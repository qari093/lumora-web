export type StreakAbuseProtectionInput = {
  userId: string;
  actionsLast24h: number;
  distinctSessionsLast24h: number;
  repeatedActionRatio: number;
  velocityScore: number;
  blocked: boolean;
};

export type StreakAbuseProtectionDecision = {
  allowed: boolean;
  reason:
    | "ok"
    | "user_blocked"
    | "excessive_action_volume"
    | "low_session_diversity"
    | "high_repetition"
    | "high_velocity";
};

export function resolveStreakAbuseProtection(
  input: StreakAbuseProtectionInput
): StreakAbuseProtectionDecision {
  if (input.blocked) {
    return { allowed: false, reason: "user_blocked" };
  }

  if (input.actionsLast24h > 500) {
    return { allowed: false, reason: "excessive_action_volume" };
  }

  if (input.distinctSessionsLast24h <= 1 && input.actionsLast24h >= 50) {
    return { allowed: false, reason: "low_session_diversity" };
  }

  if (input.repeatedActionRatio >= 0.9) {
    return { allowed: false, reason: "high_repetition" };
  }

  if (input.velocityScore >= 85) {
    return { allowed: false, reason: "high_velocity" };
  }

  return { allowed: true, reason: "ok" };
}

export function canAdvanceControlledStreakSafely(
  input: StreakAbuseProtectionInput
): boolean {
  return resolveStreakAbuseProtection(input).allowed;
}
