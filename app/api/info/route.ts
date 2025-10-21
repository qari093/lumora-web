import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "lumora-web",
    version: "0.1.0",
    env: process.env.NODE_ENV || "development",
    runtime: "nodejs",
    time: new Date().toISOString(),
  });
}
