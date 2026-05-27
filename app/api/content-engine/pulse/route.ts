import { NextResponse } from "next/server";
import { buildContentPulseSnapshot } from "@/src/content-engine/pulse";

export async function GET() {
  return NextResponse.json(
    buildContentPulseSnapshot({
      ingestionQueueDepth: 0,
      processingLatencyP95Ms: 1200,
      safetyPassRate: 0.95,
      feedPoolSize: 2,
      freshPoolSize: 2,
      globalSkipRate: 0.12,
      cdnCacheHitRatio: 0.8,
      estimatedCostPer1000Displays: 0.12,
    }),
  );
}
