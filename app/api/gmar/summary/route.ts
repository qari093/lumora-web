import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      source: "lumora_gmar_summary_v1",
      summary: {
        status: "active",
        queueOpen: true,
        activeChallenges: 3,
        rankedModes: 2,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "gmar_summary_failed" },
      { status: 500 }
    );
  }
}
