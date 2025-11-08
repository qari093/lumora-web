import { NextResponse } from "next/server";
let pkgVersion = "0.0.0";
try { pkgVersion = require("../../../package.json").version ?? pkgVersion; } catch {}
export const runtime = "nodejs";
export async function GET() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || process.env.NEXT_PUBLIC_COMMIT || null;
  const buildTime = process.env.BUILD_TIME || null;
  return NextResponse.json({ ok: true, name: "lumora-web", version: pkgVersion, commit, buildTime, node: process.version, ts: Date.now() }, { headers: { "cache-control": "no-store" } });
}
