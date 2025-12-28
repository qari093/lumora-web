import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, marker: "videos-feed", items: [], nextCursor: null, ts: new Date().toISOString() },
    { status: 200 }
  );
}
