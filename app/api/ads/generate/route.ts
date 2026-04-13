import { NextRequest, NextResponse } from "next/server";
import { generateInternalAd } from "@/lib/ads/generateInternalAd";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.portalKey) {
      return NextResponse.json(
        { ok: false, error: "missing_portal_key" },
        { status: 400 }
      );
    }

    const ad = generateInternalAd(String(body.portalKey));

    if (!ad) {
      return NextResponse.json(
        { ok: false, error: "unsupported_portal_key" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      source: "lumora_internal_ad_generator_v1",
      ad,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "internal_ad_generator_failed" },
      { status: 500 }
    );
  }
}
