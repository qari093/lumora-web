import { NextRequest, NextResponse } from "next/server";
import { calculatePerformanceTier } from "@/lib/ads/performanceTier";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.ctr !== "number" ||
      typeof body?.conversionRate !== "number" ||
      typeof body?.roi !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_performance_tier_fields" },
        { status: 400 }
      );
    }

    const result = calculatePerformanceTier({
      ctr: body.ctr,
      conversionRate: body.conversionRate,
      roi: body.roi,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_performance_tier_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "performance_tier_failed" },
      { status: 500 }
    );
  }
}
