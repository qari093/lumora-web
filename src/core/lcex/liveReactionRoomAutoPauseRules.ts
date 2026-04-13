export type LiveReactionRoomAutoPauseInput = {
  moderationFlagCount: number;
  criticalFlagCount: number;
  spamBurstScore: number;
  safetyOverrideActive: boolean;
  rightsRiskActive: boolean;
  culturalRiskActive: boolean;
};

export type LiveReactionRoomAutoPauseDecision = {
  paused: boolean;
  reason:
    | "none"
    | "critical_flags"
    | "spam_burst"
    | "safety_override"
    | "rights_risk"
    | "cultural_risk";
};

export function resolveLiveReactionRoomAutoPause(
  input: LiveReactionRoomAutoPauseInput
): LiveReactionRoomAutoPauseDecision {
  if (input.safetyOverrideActive) {
    return { paused: true, reason: "safety_override" };
  }

  if (input.rightsRiskActive) {
    return { paused: true, reason: "rights_risk" };
  }

  if (input.culturalRiskActive) {
    return { paused: true, reason: "cultural_risk" };
  }

  if (input.criticalFlagCount >= 1 || input.moderationFlagCount >= 10) {
    return { paused: true, reason: "critical_flags" };
  }

  if (input.spamBurstScore >= 80) {
    return { paused: true, reason: "spam_burst" };
  }

  return { paused: false, reason: "none" };
}

export function shouldAutoPauseLiveReactionRoom(
  input: LiveReactionRoomAutoPauseInput
): boolean {
  return resolveLiveReactionRoomAutoPause(input).paused;
}
