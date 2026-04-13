export type TrustFeedbackEscalationRulesInput = {
  priority: "low" | "medium" | "high" | "critical";
  surface:
    | "discovery"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "fandom-badge"
    | "identity"
    | "habit";
  repeatCount: number;
  safetyLinked: boolean;
};

export type TrustFeedbackEscalationRulesDecision = {
  escalate: boolean;
  queue: "none" | "ops" | "trust-safety" | "product";
  reason:
    | "ok"
    | "critical_priority"
    | "high_priority_repeat"
    | "safety_linked"
    | "product_attention";
};

export function resolveTrustFeedbackEscalation(
  input: TrustFeedbackEscalationRulesInput
): TrustFeedbackEscalationRulesDecision {
  if (input.safetyLinked) {
    return {
      escalate: true,
      queue: "trust-safety",
      reason: "safety_linked",
    };
  }

  if (input.priority === "critical") {
    return {
      escalate: true,
      queue: "ops",
      reason: "critical_priority",
    };
  }

  if (input.priority === "high" && input.repeatCount >= 3) {
    return {
      escalate: true,
      queue: "ops",
      reason: "high_priority_repeat",
    };
  }

  if (
    input.priority === "high" &&
    (input.surface === "identity" || input.surface === "discovery")
  ) {
    return {
      escalate: true,
      queue: "product",
      reason: "product_attention",
    };
  }

  return {
    escalate: false,
    queue: "none",
    reason: "ok",
  };
}

export function shouldEscalateTrustFeedback(
  input: TrustFeedbackEscalationRulesInput
): boolean {
  return resolveTrustFeedbackEscalation(input).escalate;
}
