export type EmotionalMetricsInput = {
  sessionSeconds: number;
  replayCount: number;
  vaultSaves: number;
  skippedCount: number;
  completedSession: boolean;
};

export type EmotionalRetentionSignals = {
  returnVelocityScore: number;
  vaultDepthScore: number;
  peakEndScore: number;
  fatigueRisk: "low" | "medium" | "high";
};

export function calculateEmotionalRetentionSignals(input: EmotionalMetricsInput): EmotionalRetentionSignals {
  const sessionScore = Math.min(40, Math.max(0, input.sessionSeconds / 12));
  const replayScore = Math.min(20, input.replayCount * 5);
  const saveScore = Math.min(25, input.vaultSaves * 8);
  const completionScore = input.completedSession ? 15 : 0;
  const skipPenalty = Math.min(30, input.skippedCount * 4);

  const peakEndScore = Math.max(0, sessionScore + replayScore + saveScore + completionScore - skipPenalty);

  return {
    returnVelocityScore: Math.min(100, peakEndScore + (input.vaultSaves > 0 ? 10 : 0)),
    vaultDepthScore: Math.min(100, input.vaultSaves * 20 + input.replayCount * 4),
    peakEndScore,
    fatigueRisk: input.skippedCount > 8 ? "high" : input.skippedCount > 4 ? "medium" : "low"
  };
}
