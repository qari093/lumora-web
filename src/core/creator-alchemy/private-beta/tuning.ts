import type { BetaValidationReport } from "./types";

export interface CivilizationTuningDecision {
  tuneWhispers: boolean;
  tuneDensity: boolean;
  tuneDreamChamber: boolean;
  tuneEconomy: boolean;
  reason: string;
}

export function decideCivilizationTuning(report: BetaValidationReport): CivilizationTuningDecision {
  return {
    tuneWhispers: report.averageWhisperUsefulRate < 0.65,
    tuneDensity: !report.overloadSafe,
    tuneDreamChamber: report.reasons.includes("trust_score_low"),
    tuneEconomy: report.creatorCount >= 10 && report.averageTrustScore >= 0.7,
    reason: report.readyForExpandedBeta ? "ready_for_expanded_beta" : "tuning_required"
  };
}
