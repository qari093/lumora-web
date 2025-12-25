import { NextResponse } from "next/server.js";
import { headers } from "next/headers";
import { createHash, randomUUID } from "crypto";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function safeJson(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch {
    return JSON.stringify({ _err: "json_stringify_failed" });
  }
}

export async function POST(req: Request) {
  const h = await headers();

  const ip =
    (h.get("x-forwarded-for") || "").split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "0.0.0.0";

  // Avoid storing full IP: keep a coarse prefix only
  const ipPrefix = ip.includes(":")
    ? ip.split(":").slice(0, 3).join(":") // IPv6 coarse
    : ip.split(".").slice(0, 2).join("."); // IPv4 coarse

  const ua = h.get("user-agent") || "";
  const uaHash = ua ? sha256(ua).slice(0, 16) : "na";

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const testerId = typeof body?.testerId === "string" ? body.testerId.slice(0, 128) : "na";
  const source = typeof body?.source === "string" ? body.source.slice(0, 64) : "na";
  const pathName = typeof body?.path === "string" ? body.path.slice(0, 128) : "na";
  const ref = typeof body?.ref === "string" ? body.ref.slice(0, 512) : "";
  const campaign = typeof body?.campaign === "object" && body?.campaign ? body.campaign : null;

  const evt = {
    id: randomUUID(),
    ts: new Date().toISOString(),
    type: "share_open",
    testerId,
    source,
    path: pathName,
    ref,
    campaign,
    uaHash,
    ipPrefix,
  };

  // Append NDJSON under repo-root data/
  const repoRoot = process.cwd();
  const dataDir = path.join(repoRoot, "data");
  const file = path.join(dataDir, "share-events.ndjson");
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.appendFileSync(file, safeJson(evt) + "\n", "utf8");
  } catch (e) {
    // still respond OK but include a hint
    return NextResponse.json(
      { ok: false, error: "append_failed", hint: String((e as any)?.message || e) },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
