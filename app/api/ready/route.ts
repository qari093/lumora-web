import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // "ready" is intentionally softer than "health" (but still must be 200).
  return NextResponse.json(
    { ok: true, ready: true, ts: Date.now() },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
