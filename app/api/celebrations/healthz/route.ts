import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "celebrations", marker: "celebrations-healthz", ts: new Date().toISOString() },
    { status: 200 }
  );
}
