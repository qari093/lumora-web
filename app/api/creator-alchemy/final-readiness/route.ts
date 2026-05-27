import { NextResponse } from "next/server";
import {
  buildDefaultFinalReadinessReport,
  decideFinalTuning
} from "@/src/core/creator-alchemy/final-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = buildDefaultFinalReadinessReport();
  const tuning = decideFinalTuning({
    overloadRate: 0.04,
    whisperOpenRate: 0.62,
    dreamParticipationRate: 0.31,
    economyPressure: 0.2
  });

  return NextResponse.json({
    ok: report.ok,
    status: report.status,
    report,
    tuning
  });
}
