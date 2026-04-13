import { NextRequest, NextResponse } from "next/server";
import { calculateAdFatigue } from "@/lib/ads/adFatigue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.impressions !== "number" ||
      typeof body?.uniqueAdsSeen !== "number" ||
      typeof body?.clicks !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_ad_fatigue_fields" },
        { status: 400 }
      );
    }

    const result = calculateAdFatigue({
      impressions: body.impressions,
      uniqueAdsSeen: body.uniqueAdsSeen,
      clicks: body.clicks,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_fatigue_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_fatigue_failed" },
      { status: 500 }
    );
  }
}
