import { NextRequest, NextResponse } from "next/server";
import { trackAdImpression } from "@/lib/ads/impressionTracker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.adId || !body?.portal) {
      return NextResponse.json(
        { ok: false, error: "missing_impression_fields" },
        { status: 400 }
      );
    }

    const event = trackAdImpression({
      adId: String(body.adId),
      portal: String(body.portal),
      slotIndex: typeof body?.slotIndex === "number" ? body.slotIndex : 0,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_impression_v1",
      event,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "impression_tracking_failed" },
      { status: 500 }
    );
  }
}
