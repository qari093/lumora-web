import { NextRequest, NextResponse } from "next/server";
import { evaluateFinalAdEligibility } from "@/lib/ads/finalAdEligibility";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.adId ||
      typeof body?.spent !== "number" ||
      typeof body?.budget !== "number" ||
      typeof body?.fatigueScore !== "number" ||
      typeof body?.threshold !== "number" ||
      typeof body?.seenCount !== "number" ||
      typeof body?.maxPerSession !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_final_eligibility_fields" },
        { status: 400 }
      );
    }

    const result = evaluateFinalAdEligibility({
      adId: String(body.adId),
      spent: body.spent,
      budget: body.budget,
      fatigueScore: body.fatigueScore,
      threshold: body.threshold,
      seenCount: body.seenCount,
      maxPerSession: body.maxPerSession,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_final_ad_eligibility_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "final_ad_eligibility_failed" },
      { status: 500 }
    );
  }
}
