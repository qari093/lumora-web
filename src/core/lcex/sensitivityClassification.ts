export type SensitivityClass =
  | "safe"
  | "watch"
  | "sensitive"
  | "restricted";

export type SensitivityClassificationInput = {
  violenceScore: number;
  politicalScore: number;
  religiousScore: number;
  identityScore: number;
  satireAmbiguityScore: number;
};

export type SensitivityClassificationResult = {
  score: number;
  classification: SensitivityClass;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function classifySensitivity(
  input: SensitivityClassificationInput
): SensitivityClassificationResult {
  const score = clampScore(
    input.violenceScore * 0.2 +
      input.politicalScore * 0.2 +
      input.religiousScore * 0.2 +
      input.identityScore * 0.2 +
      input.satireAmbiguityScore * 0.2
  );

  return {
    score,
    classification:
      score >= 85
        ? "restricted"
        : score >= 65
        ? "sensitive"
        : score >= 35
        ? "watch"
        : "safe",
  };
}

export function requiresSensitivityReview(
  input: SensitivityClassificationInput
): boolean {
  const result = classifySensitivity(input);
  return (
    result.classification === "sensitive" ||
    result.classification === "restricted"
  );
}
