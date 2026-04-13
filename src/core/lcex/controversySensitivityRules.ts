export type ControversySensitivityInput = {
  politicalScore: number;
  religiousScore: number;
  identityScore: number;
  historicalTraumaScore: number;
  publicBacklashScore: number;
};

export type ControversySensitivityResult = {
  score: number;
  level: "low" | "medium" | "high" | "critical";
  action: "allow" | "deprioritize" | "manual-review" | "suppress";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function resolveControversySensitivity(
  input: ControversySensitivityInput
): ControversySensitivityResult {
  const score = clampScore(
    input.politicalScore * 0.2 +
      input.religiousScore * 0.2 +
      input.identityScore * 0.2 +
      input.historicalTraumaScore * 0.2 +
      input.publicBacklashScore * 0.2
  );

  if (score >= 85) {
    return { score, level: "critical", action: "suppress" };
  }

  if (score >= 65) {
    return { score, level: "high", action: "manual-review" };
  }

  if (score >= 40) {
    return { score, level: "medium", action: "deprioritize" };
  }

  return { score, level: "low", action: "allow" };
}

export function requiresControversyReview(
  input: ControversySensitivityInput
): boolean {
  const result = resolveControversySensitivity(input);
  return result.action === "manual-review" || result.action === "suppress";
}
