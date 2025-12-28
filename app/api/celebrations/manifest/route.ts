import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, marker: "celebrations-manifest", packs: [], ts: new Date().toISOString() },
    { status: 200 }
  );
}
