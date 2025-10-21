import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

function readPkg() {
  try {
    const p = path.join(process.cwd(), "package.json");
    const raw = fs.readFileSync(p, "utf8");
    const j = JSON.parse(raw);
    return { name: j.name, version: j.version };
  } catch {
    return { name: "lumora-web", version: "0.0.0" };
  }
}

function getGit() {
  try {
    const { execSync } = require("node:child_process");
    const rev = execSync("git rev-parse --short HEAD", { stdio: ["ignore","pipe","ignore"] }).toString().trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD", { stdio: ["ignore","pipe","ignore"] }).toString().trim();
    return { rev, branch };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pkg = readPkg();
  const now = new Date().toISOString();
  const rid = (req as any).headers?.get("x-request-id") || null;

  const body = {
    ok: true,
    service: pkg.name,
    version: pkg.version,
    node: process.version,
    env: process.env.NODE_ENV || "development",
    runtime: "nodejs",
    time: now,
    path: url.pathname,
    git: getGit(),
    cors: { allowlist: process.env.LUMORA_PUBLISHER_ALLOWLIST || "localhost,127.0.0.1" },
    request: {
      origin: (req as any).headers?.get("origin") || null,
      userAgent: (req as any).headers?.get("user-agent") || null,
      requestIdHeader: rid,
    },
  };

  const res = NextResponse.json(body, { status: 200 });
  if (rid) res.headers.set("x-request-id", rid);
  return res;
}

export const runtime = "nodejs";
