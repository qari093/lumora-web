import { NextRequest, NextResponse } from "next/server";
import { calculatePortalPerformance } from "@/lib/ads/portalPerformance";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.ctr !== "number" ||
      typeof body?.engagementScore !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_performance_fields" },
        { status: 400 }
      );
    }

    const performance = calculatePortalPerformance({
      ctr: body.ctr,
      engagementScore: body.engagementScore,
      conversions: typeof body?.conversions === "number" ? body.conversions : 0,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_portal_performance_v1",
      performance,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "portal_performance_failed" },
      { status: 500 }
    );
  }
}
