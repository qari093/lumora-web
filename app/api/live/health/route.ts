import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    portal: "live",
    status: "stub",
    note: "Live portal health endpoint alive. Portal not activated.",
    ts: Date.now(),
  });
}
