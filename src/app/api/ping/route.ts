import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() }, { headers: { "Cache-Control":"no-store" } });
}
