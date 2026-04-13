export type RiskModeModerationInput = {
  trustLevel?: "low" | "medium" | "high";
  moderationLevel?: "low" | "medium" | "high";
  flaggedTerms?: number;
};

export type RiskModeModerationResult = {
  allowed: boolean;
  reason: "allowed" | "low_trust_block" | "moderation_block" | "flag_threshold_block";
};

export function evaluateRiskModeModeration(
  input: RiskModeModerationInput
): RiskModeModerationResult {
  const trustLevel = input.trustLevel ?? "medium";
  const moderationLevel = input.moderationLevel ?? "low";
  const flaggedTerms = Math.max(0, input.flaggedTerms ?? 0);

  if (trustLevel === "low") {
    return { allowed: false, reason: "low_trust_block" };
  }

  if (moderationLevel === "high") {
    return { allowed: false, reason: "moderation_block" };
  }

  if (flaggedTerms >= 3) {
    return { allowed: false, reason: "flag_threshold_block" };
  }

  return { allowed: true, reason: "allowed" };
}
