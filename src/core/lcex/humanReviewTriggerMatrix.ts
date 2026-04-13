export type HumanReviewTriggerInput = {
  culturalScore: number;
  sensitivityScore: number;
  satireAmbiguityScore: number;
  rightsScore: number;
  regionalSpreadCount: number;
};

export type HumanReviewTriggerDecision = {
  requiresReview: boolean;
  triggerReasons: string[];
  priority: "none" | "normal" | "high" | "critical";
};

export function resolveHumanReviewTriggerMatrix(
  input: HumanReviewTriggerInput
): HumanReviewTriggerDecision {
  const triggerReasons: string[] = [];

  if (input.rightsScore < 45) {
    triggerReasons.push("low_rights_confidence");
  }

  if (input.culturalScore < 45) {
    triggerReasons.push("low_cultural_confidence");
  }

  if (input.sensitivityScore >= 70) {
    triggerReasons.push("high_sensitivity");
  }

  if (input.satireAmbiguityScore >= 75) {
    triggerReasons.push("high_satire_ambiguity");
  }

  if (input.regionalSpreadCount >= 5 && input.culturalScore < 60) {
    triggerReasons.push("high_spread_low_context");
  }

  const requiresReview = triggerReasons.length > 0;

  const priority =
    triggerReasons.length >= 4
      ? "critical"
      : triggerReasons.length >= 3
      ? "high"
      : triggerReasons.length >= 1
      ? "normal"
      : "none";

  return {
    requiresReview,
    triggerReasons,
    priority,
  };
}

export function shouldEscalateToHumanReview(
  input: HumanReviewTriggerInput
): boolean {
  return resolveHumanReviewTriggerMatrix(input).requiresReview;
}
