import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    portal: "video",
    status: "stub",
    note: "Video portal health endpoint alive. Portal not activated.",
    ts: Date.now(),
  });
}
