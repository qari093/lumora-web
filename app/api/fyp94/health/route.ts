import { NextResponse } from "next/server";
import { getFyp94FeedHealth } from "@/src/lib/fyp94/production/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = getFyp94FeedHealth();

  return NextResponse.json(health, {
    status: health.ok ? 200 : 503,
    headers: {
      "cache-control": "no-store, no-cache, must-revalidate",
    },
  });
}
