import type { BetaCreatorSignal } from "./types";

export function createBetaCreatorSignal(input: BetaCreatorSignal): BetaCreatorSignal {
  return {
    ...input,
    retentionDays: Math.max(0, input.retentionDays),
    whisperUsefulRate: clamp01(input.whisperUsefulRate),
    emotionalOverloadReports: Math.max(0, input.emotionalOverloadReports),
    quietGiftUsage: Math.max(0, input.quietGiftUsage),
    dreamChamberParticipation: Math.max(0, input.dreamChamberParticipation),
    burnoutRecoverySuccess: clamp01(input.burnoutRecoverySuccess),
    trustScore: clamp01(input.trustScore)
  };
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
