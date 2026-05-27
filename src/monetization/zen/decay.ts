export function calculateZenScoreDecay(input: {
  currentScore: number;
  daysInactive: number;
  halfLifeDays?: number;
}) {
  const halfLife = input.halfLifeDays ?? 90;
  const decayFactor = Math.pow(0.5, input.daysInactive / halfLife);

  return clamp01(input.currentScore * decayFactor);
}

export function calculateRecentWeightedZenScore(input: {
  recentScore: number;
  historicalScore: number;
  recentWeight?: number;
}) {
  const recentWeight = input.recentWeight ?? 0.8;
  const historyWeight = 1 - recentWeight;

  return clamp01(input.recentScore * recentWeight + input.historicalScore * historyWeight);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
