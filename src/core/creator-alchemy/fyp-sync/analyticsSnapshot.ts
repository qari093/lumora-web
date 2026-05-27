import type { EmotionalAnalyticsSnapshot, FypCreatorSignal } from "./types";

export function buildEmotionalAnalyticsSnapshot(signal: FypCreatorSignal): EmotionalAnalyticsSnapshot {
  const quietMomentum = signal.rewatchRate * 0.45 + signal.saveRate * 0.35 + signal.completionRate * 0.2;
  const emotionalDiversity = signal.originality;
  const whisperLearningWeight = Math.min(1, signal.rewatchRate + signal.saveRate);
  const healthScore = Math.max(0, 1 - signal.burnoutRisk);

  return {
    creatorId: signal.creatorId,
    quietMomentum,
    emotionalDiversity,
    whisperLearningWeight,
    healthScore
  };
}
