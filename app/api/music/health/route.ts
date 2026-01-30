import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    portal: "music",
    status: "stub",
    note: "Music portal health endpoint alive. Portal not activated.",
    ts: Date.now(),
  });
}
