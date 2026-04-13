export type TrustFeedbackResolutionRulesInput = {
  status: "open" | "reviewed" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high" | "critical";
  actionTaken: boolean;
  responseSent: boolean;
  safetyLinked: boolean;
};

export type TrustFeedbackResolutionRulesDecision = {
  resolvable: boolean;
  nextStatus: "open" | "reviewed" | "resolved" | "dismissed";
  reason:
    | "ok"
    | "already_closed"
    | "missing_action"
    | "missing_response"
    | "safety_requires_resolution";
};

export function resolveTrustFeedbackResolution(
  input: TrustFeedbackResolutionRulesInput
): TrustFeedbackResolutionRulesDecision {
  if (input.status === "resolved" || input.status === "dismissed") {
    return {
      resolvable: false,
      nextStatus: input.status,
      reason: "already_closed",
    };
  }

  if (input.safetyLinked && !input.actionTaken) {
    return {
      resolvable: false,
      nextStatus: "reviewed",
      reason: "safety_requires_resolution",
    };
  }

  if (!input.actionTaken) {
    return {
      resolvable: false,
      nextStatus: "reviewed",
      reason: "missing_action",
    };
  }

  if (input.priority === "high" || input.priority === "critical") {
    if (!input.responseSent) {
      return {
        resolvable: false,
        nextStatus: "reviewed",
        reason: "missing_response",
      };
    }
  }

  return {
    resolvable: true,
    nextStatus: "resolved",
    reason: "ok",
  };
}

export function canResolveTrustFeedback(
  input: TrustFeedbackResolutionRulesInput
): boolean {
  return resolveTrustFeedbackResolution(input).resolvable;
}
