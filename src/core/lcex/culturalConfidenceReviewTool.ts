export type CulturalConfidenceReviewInput = {
  entityId: string;
  region?: string;
  language?: string;
  culturalScore: number;
  sensitivityScore: number;
  satireAmbiguityScore: number;
  notes?: string;
};

export type CulturalConfidenceReviewResult = {
  entityId: string;
  finalConfidence: "high" | "medium" | "low" | "restricted";
  recommendedAction:
    | "allow"
    | "deprioritize"
    | "metadata-only"
    | "region-restrict"
    | "manual-review"
    | "suppress";
  summary: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function reviewCulturalConfidence(
  input: CulturalConfidenceReviewInput
): CulturalConfidenceReviewResult {
  const culturalScore = clampScore(input.culturalScore);
  const sensitivityScore = clampScore(input.sensitivityScore);
  const satireAmbiguityScore = clampScore(input.satireAmbiguityScore);

  if (culturalScore < 25 || sensitivityScore >= 90) {
    return {
      entityId: input.entityId,
      finalConfidence: "restricted",
      recommendedAction: "suppress",
      summary: "Critical cultural or sensitivity risk detected.",
    };
  }

  if (culturalScore < 40 || satireAmbiguityScore >= 85) {
    return {
      entityId: input.entityId,
      finalConfidence: "low",
      recommendedAction: "manual-review",
      summary: "Low confidence or very high ambiguity requires manual review.",
    };
  }

  if (culturalScore < 60 || sensitivityScore >= 70) {
    return {
      entityId: input.entityId,
      finalConfidence: "medium",
      recommendedAction: "deprioritize",
      summary: "Moderate cultural risk suggests controlled visibility.",
    };
  }

  return {
    entityId: input.entityId,
    finalConfidence: "high",
    recommendedAction: "allow",
    summary: "Cultural confidence is high enough for normal surfacing.",
  };
}

export function canAutoApproveCulturalConfidence(
  result: CulturalConfidenceReviewResult
): boolean {
  return result.finalConfidence === "high" && result.recommendedAction === "allow";
}
