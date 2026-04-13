export type TrendDecayInput = {
  baseScore: number;
  detectedAt: string;
  halfLifeHours: number;
};

export type TrendDecayResult = {
  decayedScore: number;
  ageHours: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function computeTrendDecay(
  input: TrendDecayInput
): TrendDecayResult {
  const detectedTs = Date.parse(input.detectedAt);
  const nowTs = Date.now();
  const ageHours =
    Number.isNaN(detectedTs) || input.halfLifeHours <= 0
      ? 0
      : Math.max(0, (nowTs - detectedTs) / (1000 * 60 * 60));

  const decayFactor =
    input.halfLifeHours <= 0
      ? 1
      : Math.pow(0.5, ageHours / input.halfLifeHours);

  return {
    decayedScore: clampScore(input.baseScore * decayFactor),
    ageHours: Number(ageHours.toFixed(2)),
  };
}

export function isDecayedTrendStillActive(
  input: TrendDecayInput,
  minScore = 35
): boolean {
  return computeTrendDecay(input).decayedScore >= minScore;
}
