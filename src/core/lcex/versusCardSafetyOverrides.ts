export type VersusCardSafetyOverrideInput = {
  rightsScore: number;
  culturalScore: number;
  sensitivityScore: number;
  manualReviewRequired: boolean;
  suppressionActive: boolean;
};

export type VersusCardSafetyOverrideDecision = {
  allowVersusCard: boolean;
  overrideApplied: boolean;
  mode:
    | "none"
    | "deprioritize"
    | "manual-review-block"
    | "suppressed";
  reason:
    | "ok"
    | "low_rights"
    | "low_cultural_confidence"
    | "high_sensitivity"
    | "manual_review_required"
    | "suppression_active";
};

export function resolveVersusCardSafetyOverride(
  input: VersusCardSafetyOverrideInput
): VersusCardSafetyOverrideDecision {
  if (input.suppressionActive) {
    return {
      allowVersusCard: false,
      overrideApplied: true,
      mode: "suppressed",
      reason: "suppression_active",
    };
  }

  if (input.manualReviewRequired) {
    return {
      allowVersusCard: false,
      overrideApplied: true,
      mode: "manual-review-block",
      reason: "manual_review_required",
    };
  }

  if (input.rightsScore < 50) {
    return {
      allowVersusCard: false,
      overrideApplied: true,
      mode: "deprioritize",
      reason: "low_rights",
    };
  }

  if (input.culturalScore < 50) {
    return {
      allowVersusCard: false,
      overrideApplied: true,
      mode: "deprioritize",
      reason: "low_cultural_confidence",
    };
  }

  if (input.sensitivityScore >= 75) {
    return {
      allowVersusCard: false,
      overrideApplied: true,
      mode: "deprioritize",
      reason: "high_sensitivity",
    };
  }

  return {
    allowVersusCard: true,
    overrideApplied: false,
    mode: "none",
    reason: "ok",
  };
}

export function canRunVersusCardSafely(
  input: VersusCardSafetyOverrideInput
): boolean {
  return resolveVersusCardSafetyOverride(input).allowVersusCard;
}
