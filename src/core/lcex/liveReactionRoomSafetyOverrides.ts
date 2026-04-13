export type LiveReactionRoomSafetyOverrideInput = {
  rightsScore: number;
  culturalScore: number;
  sensitivityScore: number;
  manualReviewRequired: boolean;
  suppressionActive: boolean;
};

export type LiveReactionRoomSafetyOverrideDecision = {
  allowRoom: boolean;
  overrideApplied: boolean;
  mode:
    | "none"
    | "deprioritize"
    | "metadata-only"
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

export function resolveLiveReactionRoomSafetyOverride(
  input: LiveReactionRoomSafetyOverrideInput
): LiveReactionRoomSafetyOverrideDecision {
  if (input.suppressionActive) {
    return {
      allowRoom: false,
      overrideApplied: true,
      mode: "suppressed",
      reason: "suppression_active",
    };
  }

  if (input.manualReviewRequired) {
    return {
      allowRoom: false,
      overrideApplied: true,
      mode: "manual-review-block",
      reason: "manual_review_required",
    };
  }

  if (input.rightsScore < 50) {
    return {
      allowRoom: false,
      overrideApplied: true,
      mode: "metadata-only",
      reason: "low_rights",
    };
  }

  if (input.culturalScore < 50) {
    return {
      allowRoom: false,
      overrideApplied: true,
      mode: "deprioritize",
      reason: "low_cultural_confidence",
    };
  }

  if (input.sensitivityScore >= 75) {
    return {
      allowRoom: false,
      overrideApplied: true,
      mode: "deprioritize",
      reason: "high_sensitivity",
    };
  }

  return {
    allowRoom: true,
    overrideApplied: false,
    mode: "none",
    reason: "ok",
  };
}

export function canRunLiveReactionRoomSafely(
  input: LiveReactionRoomSafetyOverrideInput
): boolean {
  return resolveLiveReactionRoomSafetyOverride(input).allowRoom;
}
