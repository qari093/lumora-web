export type SystemHealthEscalationSurface =
  | "discovery"
  | "live-room"
  | "versus"
  | "prediction-pick"
  | "mood-board"
  | "fandom-badge"
  | "identity"
  | "habit"
  | "trust";

export type SystemHealthEscalationRulesInput = {
  surface: SystemHealthEscalationSurface;
  tier: "healthy" | "watch" | "high-risk" | "critical";
  trustLinked: boolean;
  safetyLinked: boolean;
  repeatCount: number;
};

export type SystemHealthEscalationRulesDecision = {
  escalate: boolean;
  queue: "none" | "ops" | "trust-safety" | "product";
  reason:
    | "ok"
    | "critical_health"
    | "high_risk_repeat"
    | "trust_linked"
    | "safety_linked"
    | "product_attention";
};

export function resolveSystemHealthEscalation(
  input: SystemHealthEscalationRulesInput
): SystemHealthEscalationRulesDecision {
  if (input.safetyLinked) {
    return {
      escalate: true,
      queue: "trust-safety",
      reason: "safety_linked",
    };
  }

  if (input.trustLinked) {
    return {
      escalate: true,
      queue: "trust-safety",
      reason: "trust_linked",
    };
  }

  if (input.tier === "critical") {
    return {
      escalate: true,
      queue: "ops",
      reason: "critical_health",
    };
  }

  if (input.tier === "high-risk" && input.repeatCount >= 3) {
    return {
      escalate: true,
      queue: "ops",
      reason: "high_risk_repeat",
    };
  }

  if (
    input.tier === "high-risk" &&
    (input.surface === "discovery" ||
      input.surface === "identity" ||
      input.surface === "trust")
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

export function shouldEscalateSystemHealth(
  input: SystemHealthEscalationRulesInput
): boolean {
  return resolveSystemHealthEscalation(input).escalate;
}
