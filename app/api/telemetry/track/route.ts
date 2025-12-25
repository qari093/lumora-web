import { NextRequest, NextResponse } from "next/server.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type TelemetryEvent = {
  type: string;
  path?: string;
  ts?: number;
  dur_ms?: number;
  meta?: Record<string, unknown>;
};

function safeJson<T = any>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000);
}

function getTesterId(req: NextRequest): string {
  // Prefer your existing cookie/id scheme if present; fallback stable anon id.
  const cookie = req.cookies.get("lumora_tester_id")?.value?.trim();
  if (cookie) return cookie;
  const h =
    req.headers.get("user-agent") +
    "|" +
    (req.headers.get("accept-language") || "") +
    "|" +
    (req.headers.get("sec-ch-ua") || "");
  return "anon_" + crypto.createHash("sha256").update(h).digest("hex").slice(0, 16);
}

function logDir(): string {
  return path.join(process.cwd(), ".lumora_telemetry");
}

function appendNdjson(file: string, obj: unknown) {
  const dir = logDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(path.join(dir, file), JSON.stringify(obj) + "\n", "utf8");
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const body = safeJson<any>(raw) ?? {};

  // Accept either:
  //  A) { events: TelemetryEvent[] }
  //  B) { type, path, dur_ms, meta }  (single event legacy)
  let events: TelemetryEvent[] = [];
  if (Array.isArray(body?.events)) {
    events = body.events;
  } else if (typeof body?.type === "string") {
    events = [
      {
        type: body.type,
        path: typeof body.path === "string" ? body.path : undefined,
        dur_ms: typeof body.dur_ms === "number" ? body.dur_ms : undefined,
        meta: body.meta && typeof body.meta === "object" ? body.meta : undefined,
      },
    ];
  }

  if (!events.length) {
    return NextResponse.json(
      { ok: false, error: "bad_request", hint: "send {events:[{type,path,meta}]} or {type,path,...}" },
      { status: 400 }
    );
  }

  const testerId = getTesterId(req);
  const ts = nowSec();

  // sanitize + persist
  const persisted = events
    .map((e) => ({
      testerId,
      ts: typeof e.ts === "number" ? e.ts : ts,
      type: String(e.type || "unknown"),
      path: e.path ? String(e.path) : undefined,
      dur_ms: typeof e.dur_ms === "number" ? e.dur_ms : undefined,
      meta: e.meta && typeof e.meta === "object" ? e.meta : undefined,
    }))
    .slice(0, 50); // cap burst

  for (const ev of persisted) appendNdjson("telemetry.ndjson", ev);

  return NextResponse.json({ ok: true, testerId, accepted: persisted.length });
}
