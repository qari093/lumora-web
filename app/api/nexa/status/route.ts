import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, marker: "nexa-status", status: "ready", ts: new Date().toISOString() },
    { status: 200 }
  );
}
