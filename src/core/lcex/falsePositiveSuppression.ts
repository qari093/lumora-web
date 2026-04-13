export type FalsePositiveSuppressionInput = {
  entityId: string;
  missRate: number;
  confidenceScore: number;
  volatilityScore: number;
  recentFalsePositives: number;
};

export type FalsePositiveSuppressionDecision = {
  suppressed: boolean;
  suppressionWeight: number;
  reason:
    | "none"
    | "high_miss_rate"
    | "high_volatility"
    | "repeated_false_positives";
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveFalsePositiveSuppression(
  input: FalsePositiveSuppressionInput
): FalsePositiveSuppressionDecision {
  const missRate = clamp(input.missRate);
  const confidenceScore = clamp(input.confidenceScore);
  const volatilityScore = clamp(input.volatilityScore);
  const repeatedPenalty = clamp(input.recentFalsePositives * 15);

  if (input.recentFalsePositives >= 3) {
    return {
      suppressed: true,
      suppressionWeight: clamp(70 + repeatedPenalty * 0.3),
      reason: "repeated_false_positives",
    };
  }

  if (missRate >= 65 && confidenceScore <= 55) {
    return {
      suppressed: true,
      suppressionWeight: clamp(missRate * 0.8),
      reason: "high_miss_rate",
    };
  }

  if (volatilityScore >= 80 && confidenceScore <= 60) {
    return {
      suppressed: true,
      suppressionWeight: clamp(volatilityScore * 0.7),
      reason: "high_volatility",
    };
  }

  return {
    suppressed: false,
    suppressionWeight: 0,
    reason: "none",
  };
}

export function shouldSuppressFalsePositive(
  input: FalsePositiveSuppressionInput
): boolean {
  return resolveFalsePositiveSuppression(input).suppressed;
}
