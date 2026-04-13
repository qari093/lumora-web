export type IdentitySignalScoringInput = {
  affinityMatchScore: number;
  vibeMatchScore: number;
  regionMatchScore: number;
  languageMatchScore: number;
  behaviorConsistencyScore: number;
};

export type IdentitySignalScoringResult = {
  score: number;
  tier: "low" | "medium" | "high" | "strong";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreIdentitySignal(
  input: IdentitySignalScoringInput
): IdentitySignalScoringResult {
  const score = clampScore(
    input.affinityMatchScore * 0.3 +
      input.vibeMatchScore * 0.25 +
      input.regionMatchScore * 0.1 +
      input.languageMatchScore * 0.1 +
      input.behaviorConsistencyScore * 0.25
  );

  return {
    score,
    tier:
      score >= 85
        ? "strong"
        : score >= 70
        ? "high"
        : score >= 50
        ? "medium"
        : "low",
  };
}

export function hasStrongIdentitySignal(
  input: IdentitySignalScoringInput
): boolean {
  const result = scoreIdentitySignal(input);
  return result.tier === "high" || result.tier === "strong";
}
