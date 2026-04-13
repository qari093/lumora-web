import { NextRequest, NextResponse } from "next/server";
import { createConversionEvent } from "@/lib/ads/conversionEvent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.adId || !body?.portal || !body?.action) {
      return NextResponse.json(
        { ok: false, error: "missing_conversion_fields" },
        { status: 400 }
      );
    }

    const event = createConversionEvent({
      adId: String(body.adId),
      portal: String(body.portal),
      action: String(body.action),
      value: typeof body?.value === "number" ? body.value : 0,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_conversion_v1",
      event,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "conversion_tracking_failed" },
      { status: 500 }
    );
  }
}
