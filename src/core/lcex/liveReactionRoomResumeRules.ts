export type LiveReactionRoomResumeInput = {
  pausedReason:
    | "none"
    | "critical_flags"
    | "spam_burst"
    | "safety_override"
    | "rights_risk"
    | "cultural_risk";
  moderationFlagCount: number;
  criticalFlagCount: number;
  spamBurstScore: number;
  safetyOverrideActive: boolean;
  rightsRiskActive: boolean;
  culturalRiskActive: boolean;
  cooldownMinutesElapsed: number;
  minResumeCooldownMinutes?: number;
};

export type LiveReactionRoomResumeDecision = {
  canResume: boolean;
  reason:
    | "ok"
    | "still_flagged"
    | "still_spam_burst"
    | "safety_override_active"
    | "rights_risk_active"
    | "cultural_risk_active"
    | "resume_cooldown_not_met";
};

export function resolveLiveReactionRoomResume(
  input: LiveReactionRoomResumeInput
): LiveReactionRoomResumeDecision {
  const minResumeCooldownMinutes = input.minResumeCooldownMinutes ?? 10;

  if (input.safetyOverrideActive) {
    return { canResume: false, reason: "safety_override_active" };
  }

  if (input.rightsRiskActive) {
    return { canResume: false, reason: "rights_risk_active" };
  }

  if (input.culturalRiskActive) {
    return { canResume: false, reason: "cultural_risk_active" };
  }

  if (input.criticalFlagCount > 0 || input.moderationFlagCount >= 5) {
    return { canResume: false, reason: "still_flagged" };
  }

  if (input.spamBurstScore >= 50) {
    return { canResume: false, reason: "still_spam_burst" };
  }

  if (input.cooldownMinutesElapsed < minResumeCooldownMinutes) {
    return { canResume: false, reason: "resume_cooldown_not_met" };
  }

  return { canResume: true, reason: "ok" };
}

export function shouldResumeLiveReactionRoom(
  input: LiveReactionRoomResumeInput
): boolean {
  return resolveLiveReactionRoomResume(input).canResume;
}
