import type { SafetySignal } from "./types";

export function calculateRelationshipTrustScore(params: {
  baseTrust: number;
  priorShares: number;
  successfulDeliveries: number;
  safetySignals: SafetySignal[];
}): number {
  const successBoost = Math.min(0.22, params.successfulDeliveries * 0.025);
  const familiarityBoost = Math.min(0.16, params.priorShares * 0.015);
  const riskPenalty = Math.min(0.8, params.safetySignals.reduce((sum, signal) => sum + signal.score, 0) * 0.22);

  return Number(Math.max(0, Math.min(1, params.baseTrust + successBoost + familiarityBoost - riskPenalty)).toFixed(4));
}
