export type SystemHealthScoringInput = {
  errorRate: number;
  latencyScore: number;
  dropOffScore: number;
  trustRiskScore: number;
  safetyRiskScore: number;
};

export type SystemHealthScoringResult = {
  score: number;
  tier: "healthy" | "watch" | "high-risk" | "critical";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreSystemHealth(
  input: SystemHealthScoringInput
): SystemHealthScoringResult {
  const score = clampScore(
    input.errorRate * 0.25 +
      input.latencyScore * 0.2 +
      input.dropOffScore * 0.2 +
      input.trustRiskScore * 0.15 +
      input.safetyRiskScore * 0.2
  );

  return {
    score,
    tier:
      score >= 85
        ? "critical"
        : score >= 65
        ? "high-risk"
        : score >= 40
        ? "watch"
        : "healthy",
  };
}

export function isSystemHealthCritical(
  input: SystemHealthScoringInput
): boolean {
  const result = scoreSystemHealth(input);
  return result.tier === "critical" || result.tier === "high-risk";
}
