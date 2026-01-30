import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    portal: "nexa",
    status: "stub",
    note: "NEXA portal health endpoint alive. Portal not activated.",
    ts: Date.now(),
  });
}
