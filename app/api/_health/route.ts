import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, route: "/api/_health", ts: new Date().toISOString() },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
