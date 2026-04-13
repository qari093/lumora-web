export type MoodBoardSafetyOverridesInput = {
  rightsScore: number;
  culturalScore: number;
  sensitivityScore: number;
  manualReviewRequired: boolean;
  suppressionActive: boolean;
};

export type MoodBoardSafetyOverridesDecision = {
  allowMoodBoard: boolean;
  overrideApplied: boolean;
  mode:
    | "none"
    | "filtered"
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

export function resolveMoodBoardSafetyOverride(
  input: MoodBoardSafetyOverridesInput
): MoodBoardSafetyOverridesDecision {
  if (input.suppressionActive) {
    return {
      allowMoodBoard: false,
      overrideApplied: true,
      mode: "suppressed",
      reason: "suppression_active",
    };
  }

  if (input.manualReviewRequired) {
    return {
      allowMoodBoard: false,
      overrideApplied: true,
      mode: "manual-review-block",
      reason: "manual_review_required",
    };
  }

  if (input.rightsScore < 50) {
    return {
      allowMoodBoard: false,
      overrideApplied: true,
      mode: "filtered",
      reason: "low_rights",
    };
  }

  if (input.culturalScore < 50) {
    return {
      allowMoodBoard: false,
      overrideApplied: true,
      mode: "filtered",
      reason: "low_cultural_confidence",
    };
  }

  if (input.sensitivityScore >= 75) {
    return {
      allowMoodBoard: false,
      overrideApplied: true,
      mode: "filtered",
      reason: "high_sensitivity",
    };
  }

  return {
    allowMoodBoard: true,
    overrideApplied: false,
    mode: "none",
    reason: "ok",
  };
}

export function canRenderMoodBoardSafely(
  input: MoodBoardSafetyOverridesInput
): boolean {
  return resolveMoodBoardSafetyOverride(input).allowMoodBoard;
}
