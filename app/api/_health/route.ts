import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "healthy",
    now: new Date().toISOString(),
    uptimeSec: Math.round(process.uptime()),
    node: process.version,
    env: process.env.NODE_ENV || "development",
  }, { status: 200 });
}

export const runtime = "nodejs";
