export type CulturalDemotionInput = {
  culturalScore: number;
  sensitivityScore: number;
  satireAmbiguityScore: number;
  fatigueScore: number;
};

export type CulturalDemotionDecision = {
  demote: boolean;
  demotionLevel: "none" | "soft" | "medium" | "hard";
  reason:
    | "none"
    | "low_cultural_score"
    | "high_sensitivity"
    | "high_satire_ambiguity"
    | "compounded_risk";
};

export function resolveCulturalDemotion(
  input: CulturalDemotionInput
): CulturalDemotionDecision {
  if (
    input.culturalScore < 35 ||
    (input.sensitivityScore >= 85 && input.satireAmbiguityScore >= 75)
  ) {
    return {
      demote: true,
      demotionLevel: "hard",
      reason: "compounded_risk",
    };
  }

  if (input.sensitivityScore >= 75) {
    return {
      demote: true,
      demotionLevel: "medium",
      reason: "high_sensitivity",
    };
  }

  if (input.satireAmbiguityScore >= 70) {
    return {
      demote: true,
      demotionLevel: "medium",
      reason: "high_satire_ambiguity",
    };
  }

  if (input.culturalScore < 55 || input.fatigueScore >= 80) {
    return {
      demote: true,
      demotionLevel: "soft",
      reason: "low_cultural_score",
    };
  }

  return {
    demote: false,
    demotionLevel: "none",
    reason: "none",
  };
}

export function shouldCulturallyDemote(
  input: CulturalDemotionInput
): boolean {
  return resolveCulturalDemotion(input).demote;
}
