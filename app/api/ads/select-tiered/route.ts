import { NextRequest, NextResponse } from "next/server";
import { selectTieredAds } from "@/lib/ads/selectTieredAds";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.ads)) {
      return NextResponse.json(
        { ok: false, error: "missing_tiered_ads" },
        { status: 400 }
      );
    }

    const selected = selectTieredAds({
      ads: body.ads,
      maxSlots: typeof body?.maxSlots === "number" ? body.maxSlots : 3,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_tiered_ad_selector_v1",
      selected,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "tiered_ad_selection_failed" },
      { status: 500 }
    );
  }
}
