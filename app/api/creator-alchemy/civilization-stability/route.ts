import { NextResponse } from "next/server";
import { buildCivilizationStabilityReport } from "@/src/core/creator-alchemy/civilization-stability";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = buildCivilizationStabilityReport({
    governance: {
      diagnosticLanguage: 0,
      guiltPressure: 0,
      casinoRisk: 0,
      creatorBurnoutRisk: 0.2,
      consentRisk: 0,
      manipulationRisk: 0
    },
    infrastructure: {
      batchJobLoad: 0.3,
      cacheHitRatio: 0.8,
      queueDepth: 10,
      liveRoomLoad: 0.4,
      runtimeCostPressure: 0.3
    }
  });

  return NextResponse.json({ ok: report.level === "stable", report });
}
