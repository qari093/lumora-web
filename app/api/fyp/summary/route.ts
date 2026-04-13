import { NextResponse } from "next/server";
import { getFypFeedSummary } from "@/lib/fyp/getFypFeedSummary";

export async function GET() {
  try {
    const feed = [
      { id: "content_1", kind: "content", title: "Welcome to Lumora" },
      { id: "content_2", kind: "content", title: "Trending now" },
      { id: "ad_1", kind: "sponsored", adId: "ad_launch_001", title: "Try NEXA" },
      { id: "content_3", kind: "content", title: "Creator spotlight" },
    ];

    const summary = getFypFeedSummary(feed);

    return NextResponse.json({
      ok: true,
      source: "lumora_fyp_summary_v1",
      summary,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "fyp_summary_failed" },
      { status: 500 }
    );
  }
}
