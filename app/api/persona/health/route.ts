import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "persona", ts: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } }
  );
}
