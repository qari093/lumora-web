import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * /api/ready — readiness probe.
 * Must be fast, side-effect free, and return JSON.
 */
export async function GET() {
  return NextResponse.json(
    { ok: true, ready: true, ts: Date.now() },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
