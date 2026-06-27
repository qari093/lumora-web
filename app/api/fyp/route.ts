import { NextResponse } from "next/server";
import { getProductionFypFeed } from "@/src/core/fyp/feed/productionFeedAdapter";

export const dynamic = "force-dynamic";

export function GET() {
  const feed = getProductionFypFeed();

  return NextResponse.json(feed, {
    status: feed.ok ? 200 : 500,
    headers: {
      "cache-control": "no-store",
      "x-lumora-fyp-source": "lumora_genesis_fyp_v1"
    }
  });
}
