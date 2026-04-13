export type TrendBountyScoringInput = {
  discoveryAccuracyScore: number;
  originalityScore: number;
  culturalRelevanceScore: number;
  timingScore: number;
  engagementScore: number;
  safetyScore: number;
};

export type TrendBountyScoringResult = {
  totalScore: number;
  tier: "low" | "qualified" | "high" | "elite";
  valid: boolean;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreTrendBounty(
  input: TrendBountyScoringInput
): TrendBountyScoringResult {
  if (input.safetyScore < 60) {
    return {
      totalScore: 0,
      tier: "low",
      valid: false,
    };
  }

  const totalScore = clampScore(
    input.discoveryAccuracyScore * 0.25 +
      input.originalityScore * 0.2 +
      input.culturalRelevanceScore * 0.2 +
      input.timingScore * 0.15 +
      input.engagementScore * 0.2
  );

  return {
    totalScore,
    tier:
      totalScore >= 85
        ? "elite"
        : totalScore >= 70
        ? "high"
        : totalScore >= 55
        ? "qualified"
        : "low",
    valid: totalScore >= 55,
  };
}

export function isTrendBountyQualified(
  input: TrendBountyScoringInput
): boolean {
  return scoreTrendBounty(input).valid;
}
