import { NextRequest, NextResponse } from "next/server";
import { trackAdClick } from "@/lib/ads/clickTracker";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const value = searchParams.get("value");

    if (!type || !value) {
      return NextResponse.json(
        { ok: false, error: "missing_click_params" },
        { status: 400 }
      );
    }

    const event = trackAdClick({ type, value });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_click_v1",
      event,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "click_tracking_failed" },
      { status: 500 }
    );
  }
}
