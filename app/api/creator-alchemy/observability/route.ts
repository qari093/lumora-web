import { NextResponse } from "next/server";
import { buildObservabilitySnapshot } from "@/src/core/creator-alchemy/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    observability: buildObservabilitySnapshot({
      pendingQueue: 0,
      cacheHitRatio: 0.88,
      rateLimitRemaining: 100
    })
  });
}
