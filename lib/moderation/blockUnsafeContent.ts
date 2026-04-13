export type UnsafeContentInput = {
  moderationAllowed?: boolean;
  trustLevel?: "low" | "medium" | "high";
  isRiskMode?: boolean;
};

export type UnsafeContentResult = {
  blocked: boolean;
  reason: "allowed" | "moderation_block" | "low_trust_risk_block";
  action: "allow" | "queue_review" | "block";
};

export function blockUnsafeContent(
  input: UnsafeContentInput
): UnsafeContentResult {
  const moderationAllowed = input.moderationAllowed ?? true;
  const trustLevel = input.trustLevel ?? "medium";
  const isRiskMode = Boolean(input.isRiskMode);

  if (!moderationAllowed) {
    return {
      blocked: true,
      reason: "moderation_block",
      action: "block",
    };
  }

  if (isRiskMode && trustLevel === "low") {
    return {
      blocked: true,
      reason: "low_trust_risk_block",
      action: "block",
    };
  }

  return {
    blocked: false,
    reason: "allowed",
    action: "allow",
  };
}
