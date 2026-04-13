import { NextRequest, NextResponse } from "next/server";
import { selectBudgetedAds } from "@/lib/ads/selectBudgetedAds";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.ads)) {
      return NextResponse.json(
        { ok: false, error: "missing_budgeted_ads" },
        { status: 400 }
      );
    }

    const selected = selectBudgetedAds({
      ads: body.ads,
      maxSlots: typeof body?.maxSlots === "number" ? body.maxSlots : 3,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_budgeted_selector_v1",
      selected,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "budgeted_selection_failed" },
      { status: 500 }
    );
  }
}
