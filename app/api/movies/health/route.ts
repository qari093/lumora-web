import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    portal: "movies",
    status: "stub",
    note: "Movies portal health endpoint alive. Portal not activated.",
    ts: Date.now(),
  });
}
