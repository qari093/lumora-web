import { NextRequest, NextResponse } from "next/server";
import { rankAds } from "@/lib/ads/rankAds";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.ads)) {
      return NextResponse.json(
        { ok: false, error: "missing_rank_ads" },
        { status: 400 }
      );
    }

    const ranked = rankAds({ ads: body.ads });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_ranking_v1",
      ranked,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_ranking_failed" },
      { status: 500 }
    );
  }
}
