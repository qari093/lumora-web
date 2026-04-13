import { NextRequest, NextResponse } from "next/server";
import { createExposureSummary } from "@/lib/ads/exposureSummary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.impressions !== "number" ||
      typeof body?.clicks !== "number" ||
      typeof body?.conversions !== "number" ||
      typeof body?.uniqueAdsSeen !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_exposure_summary_fields" },
        { status: 400 }
      );
    }

    const summary = createExposureSummary({
      impressions: body.impressions,
      clicks: body.clicks,
      conversions: body.conversions,
      uniqueAdsSeen: body.uniqueAdsSeen,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_exposure_summary_v1",
      summary,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "exposure_summary_failed" },
      { status: 500 }
    );
  }
}
