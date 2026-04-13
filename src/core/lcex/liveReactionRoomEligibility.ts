export type LiveReactionRoomEligibilityInput = {
  trendScore: number;
  confidenceScore: number;
  culturalScore: number;
  rightsScore: number;
  ageRestricted: boolean;
};

export type LiveReactionRoomEligibilityResult = {
  eligible: boolean;
  reason:
    | "ok"
    | "low_trend"
    | "low_confidence"
    | "low_cultural_score"
    | "low_rights_score"
    | "age_restricted";
};

export function resolveLiveReactionRoomEligibility(
  input: LiveReactionRoomEligibilityInput
): LiveReactionRoomEligibilityResult {
  if (input.ageRestricted) {
    return { eligible: false, reason: "age_restricted" };
  }

  if (input.rightsScore < 55) {
    return { eligible: false, reason: "low_rights_score" };
  }

  if (input.culturalScore < 50) {
    return { eligible: false, reason: "low_cultural_score" };
  }

  if (input.confidenceScore < 55) {
    return { eligible: false, reason: "low_confidence" };
  }

  if (input.trendScore < 60) {
    return { eligible: false, reason: "low_trend" };
  }

  return { eligible: true, reason: "ok" };
}

export function canOpenLiveReactionRoom(
  input: LiveReactionRoomEligibilityInput
): boolean {
  return resolveLiveReactionRoomEligibility(input).eligible;
}
