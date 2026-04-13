import { NextRequest, NextResponse } from "next/server";
import { evaluateRiskModeModeration } from "@/lib/moderation/riskModeModeration";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = evaluateRiskModeModeration({
      trustLevel:
        body?.trustLevel === "low" || body?.trustLevel === "medium" || body?.trustLevel === "high"
          ? body.trustLevel
          : "medium",
      moderationLevel:
        body?.moderationLevel === "low" || body?.moderationLevel === "medium" || body?.moderationLevel === "high"
          ? body.moderationLevel
          : "low",
      flaggedTerms:
        typeof body?.flaggedTerms === "number" ? body.flaggedTerms : 0,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_risk_mode_moderation_v1",
      ...result,
    }, { status: result.allowed ? 200 : 403 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "risk_mode_moderation_failed" },
      { status: 500 }
    );
  }
}
