import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      source: "lumora_live_summary_v1",
      summary: {
        status: "active",
        roomsActive: 5,
        streamsLive: 2,
        moderationReady: true,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "live_summary_failed" },
      { status: 500 }
    );
  }
}
