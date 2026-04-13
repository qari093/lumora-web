import { NextRequest, NextResponse } from "next/server";
import { calculateCtr } from "@/lib/ads/ctrMetrics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.impressions !== "number" ||
      typeof body?.clicks !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_ctr_fields" },
        { status: 400 }
      );
    }

    const metrics = calculateCtr({
      impressions: body.impressions,
      clicks: body.clicks,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_ctr_v1",
      metrics,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ctr_metrics_failed" },
      { status: 500 }
    );
  }
}
