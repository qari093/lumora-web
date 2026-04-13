import { NextRequest, NextResponse } from "next/server";
import { filterAdsByFrequency } from "@/lib/ads/filterAdsByFrequency";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body?.ads)) {
      return NextResponse.json(
        { ok: false, error: "missing_filter_ads" },
        { status: 400 }
      );
    }

    const filtered = filterAdsByFrequency({
      ads: body.ads,
      maxPerSession: typeof body?.maxPerSession === "number" ? body.maxPerSession : 3,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_frequency_filter_v1",
      filtered,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "ad_frequency_filter_failed" },
      { status: 500 }
    );
  }
}
