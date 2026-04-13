import { NextRequest, NextResponse } from "next/server";
import { calculateConversionRate } from "@/lib/ads/conversionRate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.clicks !== "number" ||
      typeof body?.conversions !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_conversion_rate_fields" },
        { status: 400 }
      );
    }

    const metrics = calculateConversionRate({
      clicks: body.clicks,
      conversions: body.conversions,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_conversion_rate_v1",
      metrics,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "conversion_rate_failed" },
      { status: 500 }
    );
  }
}
