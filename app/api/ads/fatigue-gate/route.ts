import { NextRequest, NextResponse } from "next/server";
import { evaluateFatigueGate } from "@/lib/ads/fatigueGate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.adId ||
      typeof body?.fatigueScore !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_fatigue_gate_fields" },
        { status: 400 }
      );
    }

    const result = evaluateFatigueGate({
      adId: String(body.adId),
      fatigueScore: body.fatigueScore,
      threshold: typeof body?.threshold === "number" ? body.threshold : 0.45,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_fatigue_gate_v1",
      result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "fatigue_gate_failed" },
      { status: 500 }
    );
  }
}
