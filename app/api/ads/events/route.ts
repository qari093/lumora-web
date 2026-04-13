import { NextRequest, NextResponse } from "next/server";
import { aggregateAdEvents } from "@/lib/ads/eventAggregator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.impressions !== "number" &&
      typeof body?.clicks !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_event_fields" },
        { status: 400 }
      );
    }

    const summary = aggregateAdEvents({
      impressions: body.impressions,
      clicks: body.clicks,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_event_aggregator_v1",
      summary,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "event_aggregation_failed" },
      { status: 500 }
    );
  }
}
