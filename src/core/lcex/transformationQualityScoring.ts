export type TransformationQualityInput = {
  clarityScore: number;
  originalityScore: number;
  safetyScore: number;
  relevanceScore: number;
  brevityScore: number;
};

export type TransformationQualityResult = {
  score: number;
  bucket: "low" | "medium" | "high" | "premium";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreTransformationQuality(
  input: TransformationQualityInput
): TransformationQualityResult {
  const score = clampScore(
    input.clarityScore * 0.22 +
      input.originalityScore * 0.2 +
      input.safetyScore * 0.24 +
      input.relevanceScore * 0.22 +
      input.brevityScore * 0.12
  );

  return {
    score,
    bucket:
      score >= 90
        ? "premium"
        : score >= 75
        ? "high"
        : score >= 50
        ? "medium"
        : "low",
  };
}

export function isHighQualityTransformation(
  input: TransformationQualityInput
): boolean {
  const result = scoreTransformationQuality(input);
  return result.bucket === "high" || result.bucket === "premium";
}
