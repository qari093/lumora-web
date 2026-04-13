export type CulturalSuppressionInput = {
  culturalScore: number;
  sensitivityScore: number;
  rightsScore: number;
  satireAmbiguityScore: number;
  humanReviewRequired: boolean;
};

export type CulturalSuppressionDecision = {
  suppress: boolean;
  reason:
    | "none"
    | "critical_cultural_risk"
    | "critical_sensitivity"
    | "rights_failure"
    | "manual_review_block";
};

export function resolveCulturalSuppression(
  input: CulturalSuppressionInput
): CulturalSuppressionDecision {
  if (input.rightsScore < 25) {
    return {
      suppress: true,
      reason: "rights_failure",
    };
  }

  if (input.humanReviewRequired && input.culturalScore < 35) {
    return {
      suppress: true,
      reason: "manual_review_block",
    };
  }

  if (input.sensitivityScore >= 90) {
    return {
      suppress: true,
      reason: "critical_sensitivity",
    };
  }

  if (input.culturalScore < 25 || input.satireAmbiguityScore >= 90) {
    return {
      suppress: true,
      reason: "critical_cultural_risk",
    };
  }

  return {
    suppress: false,
    reason: "none",
  };
}

export function shouldCulturallySuppress(
  input: CulturalSuppressionInput
): boolean {
  return resolveCulturalSuppression(input).suppress;
}
