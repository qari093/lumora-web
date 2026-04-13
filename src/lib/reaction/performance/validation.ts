export type ReactionPerformanceStatus = {
  withinBudget: boolean;
  targetMs: number;
  measuredMs: number;
};

export function validateReactionPerformance(measuredMs = 12): ReactionPerformanceStatus {
  const targetMs = 16;
  return {
    withinBudget: measuredMs <= targetMs,
    targetMs,
    measuredMs,
  };
}
