import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      source: "lumora_nexa_summary_v1",
      summary: {
        status: "active",
        routinesActive: 4,
        insightsReady: true,
        recoveryMode: "balanced",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "nexa_summary_failed" },
      { status: 500 }
    );
  }
}
