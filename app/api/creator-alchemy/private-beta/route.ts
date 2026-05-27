import { NextResponse } from "next/server";
import {
  createBetaCreatorSignal,
  decideCivilizationTuning,
  validatePrivateBetaCivilization
} from "@/src/core/creator-alchemy/private-beta";

export const dynamic = "force-dynamic";

export async function GET() {
  const signals = Array.from({ length: 12 }, (_, index) =>
    createBetaCreatorSignal({
      creatorId: `beta-${index + 1}`,
      retentionDays: 14,
      whisperUsefulRate: 0.72,
      emotionalOverloadReports: 0,
      quietGiftUsage: 4,
      dreamChamberParticipation: 2,
      burnoutRecoverySuccess: 0.8,
      trustScore: 0.82
    })
  );

  const report = validatePrivateBetaCivilization(signals);
  const tuning = decideCivilizationTuning(report);

  return NextResponse.json({ ok: report.readyForExpandedBeta, report, tuning });
}
