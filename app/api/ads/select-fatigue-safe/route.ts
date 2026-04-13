import { NextRequest, NextResponse } from "next/server";
import { selectFatigueSafeAds } from "@/lib/ads/selectFatigueSafeAds";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.ads)) {
      return NextResponse.json(
        { ok: false, error: "missing_fatigue_safe_ads" },
        { status: 400 }
      );
    }

    const selected = selectFatigueSafeAds({
      ads: body.ads,
      maxSlots: typeof body?.maxSlots === "number" ? body.maxSlots : 3,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_fatigue_safe_selector_v1",
      selected,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "fatigue_safe_selection_failed" },
      { status: 500 }
    );
  }
}
