import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      source: "lumora_cineverse_summary_v1",
      summary: {
        status: "active",
        featuredTitles: 12,
        trailersReady: true,
        spotlightCategory: "Sci-Fi",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "cineverse_summary_failed" },
      { status: 500 }
    );
  }
}
