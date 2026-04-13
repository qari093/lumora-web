import { NextRequest, NextResponse } from "next/server";
import { calculateRoi } from "@/lib/ads/roiScore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.revenue !== "number" ||
      typeof body?.cost !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_roi_fields" },
        { status: 400 }
      );
    }

    const metrics = calculateRoi({
      revenue: body.revenue,
      cost: body.cost,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_roi_v1",
      metrics,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "roi_calculation_failed" },
      { status: 500 }
    );
  }
}
