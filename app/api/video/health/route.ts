import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    portal: "video",
    status: "ok",
    note: "Health endpoint active; product activation and content readiness are not asserted.",
    ts: Date.now(),
  });
}
