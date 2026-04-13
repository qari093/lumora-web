import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      source: "lumora_profile_summary_v1",
      summary: {
        status: "active",
        creatorMode: true,
        completionScore: 82,
        identityReady: true,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "profile_summary_failed" },
      { status: 500 }
    );
  }
}
