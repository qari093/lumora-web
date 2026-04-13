export type CanonicalCloseoutScoringInput = {
  contractsScore: number;
  guardsScore: number;
  telemetryScore: number;
  summariesScore: number;
  locksScore: number;
  readinessScore: number;
};

export type CanonicalCloseoutScoringResult = {
  score: number;
  tier: "incomplete" | "stabilizing" | "strong" | "canonical";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreCanonicalCloseout(
  input: CanonicalCloseoutScoringInput
): CanonicalCloseoutScoringResult {
  const score = clampScore(
    input.contractsScore * 0.2 +
      input.guardsScore * 0.2 +
      input.telemetryScore * 0.15 +
      input.summariesScore * 0.1 +
      input.locksScore * 0.15 +
      input.readinessScore * 0.2
  );

  return {
    score,
    tier:
      score >= 95
        ? "canonical"
        : score >= 85
        ? "strong"
        : score >= 65
        ? "stabilizing"
        : "incomplete",
  };
}

export function isCanonicalCloseoutReady(
  input: CanonicalCloseoutScoringInput
): boolean {
  const result = scoreCanonicalCloseout(input);
  return result.tier === "strong" || result.tier === "canonical";
}
