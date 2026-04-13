import { NextRequest, NextResponse } from "next/server";
import { createAnalyticsSnapshot } from "@/lib/ads/analyticsSnapshot";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.impressions !== "number" ||
      typeof body?.clicks !== "number" ||
      typeof body?.conversions !== "number" ||
      typeof body?.revenue !== "number" ||
      typeof body?.cost !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_analytics_snapshot_fields" },
        { status: 400 }
      );
    }

    const snapshot = createAnalyticsSnapshot({
      impressions: body.impressions,
      clicks: body.clicks,
      conversions: body.conversions,
      revenue: body.revenue,
      cost: body.cost,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_analytics_snapshot_v1",
      snapshot,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "analytics_snapshot_failed" },
      { status: 500 }
    );
  }
}
