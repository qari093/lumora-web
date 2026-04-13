import { NextRequest, NextResponse } from "next/server";
import { selectAds } from "@/lib/ads/selectAds";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.ranked)) {
      return NextResponse.json(
        { ok: false, error: "missing_ranked_ads" },
        { status: 400 }
      );
    }

    const selected = selectAds({
      ranked: body.ranked,
      maxSlots: typeof body?.maxSlots === "number" ? body.maxSlots : 3,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_selector_v1",
      selected,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_selection_failed" },
      { status: 500 }
    );
  }
}
