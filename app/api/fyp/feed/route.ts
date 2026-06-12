import { NextResponse } from "next/server";

import { applyTraceAwareFeedRerank } from "@/src/core/fyp/runtime-learning/traceAwareRerank";

export const dynamic = "force-dynamic";

export async function GET() {
  const runtime = applyTraceAwareFeedRerank();

  const items = runtime.cards.map((card) => ({
    id: card.id,
    title: card.title,
    slug: card.id,
    creator: card.creator,
    category: card.traceLane,
    sourceId: card.sourceId,
    videoUrl: card.playbackUrl,
    playbackUrl: card.playbackUrl,
    lane: card.traceLane,
    deliveryLane: card.lane,
    rankScore: card.rankScore,
    rankReasons: card.rankReasons,
    autoplayEligible: card.autoplayEligible
  }));

  return NextResponse.json(
    {
      ok: true,
      source: "lumora_runtime_chain",
      runtime: {
        megaPacks: "05-07",
        coldStartApplied: runtime.coldStartApplied,
        traceCoverage: runtime.traceCoverage
      },
      count: items.length,
      items,
      ts: new Date().toISOString()
    },
    {
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}
