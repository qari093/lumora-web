import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "nexa", marker: "nexa-healthz", ts: new Date().toISOString() },
    { status: 200 }
  );
}
