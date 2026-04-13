export type RightsConfidenceInput = {
  sourceVerified: boolean;
  rightsDeclarationPresent: boolean;
  regionCoverageCount: number;
  historicalComplianceScore: number;
  manualApprovalPresent: boolean;
};

export type RightsConfidenceResult = {
  score: number;
  bucket: "low" | "medium" | "high" | "verified";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreRightsConfidence(
  input: RightsConfidenceInput
): RightsConfidenceResult {
  const score = clampScore(
    (input.sourceVerified ? 25 : 0) +
      (input.rightsDeclarationPresent ? 20 : 0) +
      Math.min(15, input.regionCoverageCount * 3) +
      input.historicalComplianceScore * 0.25 +
      (input.manualApprovalPresent ? 20 : 0)
  );

  return {
    score,
    bucket:
      score >= 90
        ? "verified"
        : score >= 70
        ? "high"
        : score >= 45
        ? "medium"
        : "low",
  };
}

export function hasSufficientRightsConfidence(
  input: RightsConfidenceInput
): boolean {
  const result = scoreRightsConfidence(input);
  return result.bucket === "high" || result.bucket === "verified";
}
