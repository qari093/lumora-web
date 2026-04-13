export type FinalReadinessScoringInput = {
  completionScore: number;
  safetyScore: number;
  trustScore: number;
  opsScore: number;
  rolloutScore: number;
};

export type FinalReadinessScoringResult = {
  score: number;
  tier: "not-ready" | "watch" | "ready" | "launch-ready";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreFinalReadiness(
  input: FinalReadinessScoringInput
): FinalReadinessScoringResult {
  const score = clampScore(
    input.completionScore * 0.3 +
      input.safetyScore * 0.2 +
      input.trustScore * 0.15 +
      input.opsScore * 0.2 +
      input.rolloutScore * 0.15
  );

  return {
    score,
    tier:
      score >= 92
        ? "launch-ready"
        : score >= 80
        ? "ready"
        : score >= 60
        ? "watch"
        : "not-ready",
  };
}

export function isLaunchReady(
  input: FinalReadinessScoringInput
): boolean {
  const result = scoreFinalReadiness(input);
  return result.tier === "launch-ready" || result.tier === "ready";
}
