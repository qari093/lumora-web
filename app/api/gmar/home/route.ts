import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, marker: "gmar-home", featured: [], ts: new Date().toISOString() },
    { status: 200 }
  );
}
