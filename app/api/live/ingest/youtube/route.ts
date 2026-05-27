import { NextResponse } from "next/server";
import { ingestYoutubeFeeds } from "@/src/lib/media-ingestion/youtube";

export async function GET() {
  try {
    const items = await ingestYoutubeFeeds();

    return NextResponse.json({
      ok: true,
      live_status: items.length ? "candidate_live" : "not_live",
      proof_status: items.length ? "pending" : "failed",
      source_of_truth: "youtube_atom_feeds",
      data: {
        count: items.length,
        top: items.slice(0, 5),
      },
      ts: Date.now(),
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        live_status: "failed",
        proof_status: "failed",
        source_of_truth: "youtube_atom_feeds",
        error: e?.message || "unknown_error",
        ts: Date.now(),
      },
      { status: 500 }
    );
  }
}
