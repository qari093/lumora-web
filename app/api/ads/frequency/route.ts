import { NextRequest, NextResponse } from "next/server";
import { checkAdFrequency } from "@/lib/ads/frequencyCap";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.userId ||
      !body?.adId ||
      typeof body?.currentCount !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_frequency_fields" },
        { status: 400 }
      );
    }

    const result = checkAdFrequency({
      userId: String(body.userId),
      adId: String(body.adId),
      currentCount: body.currentCount,
      maxPerSession: typeof body?.maxPerSession === "number" ? body.maxPerSession : 3,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_ad_frequency_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "frequency_check_failed" },
      { status: 500 }
    );
  }
}
