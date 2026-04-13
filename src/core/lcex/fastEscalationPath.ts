export type FastEscalationPriority =
  | "normal"
  | "high"
  | "critical";

export type FastEscalationInput = {
  entityId: string;
  title: string;
  culturalScore: number;
  sensitivityScore: number;
  rightsScore: number;
  regionalSpreadCount: number;
  triggerReasons: string[];
};

export type FastEscalationResult = {
  escalated: boolean;
  priority: FastEscalationPriority;
  routeTo: "ops" | "culture-guardians" | "legal" | "exec-review";
  reason: string;
};

export function resolveFastEscalationPath(
  input: FastEscalationInput
): FastEscalationResult {
  if (input.rightsScore < 25) {
    return {
      escalated: true,
      priority: "critical",
      routeTo: "legal",
      reason: "Critical rights risk requires immediate legal escalation.",
    };
  }

  if (input.sensitivityScore >= 90 || input.culturalScore < 25) {
    return {
      escalated: true,
      priority: "critical",
      routeTo: "culture-guardians",
      reason: "Critical cultural or sensitivity risk requires immediate culture escalation.",
    };
  }

  if (input.regionalSpreadCount >= 8 || input.triggerReasons.length >= 4) {
    return {
      escalated: true,
      priority: "high",
      routeTo: "ops",
      reason: "High spread or multi-trigger risk requires fast ops escalation.",
    };
  }

  if (input.triggerReasons.length >= 2) {
    return {
      escalated: true,
      priority: "normal",
      routeTo: "ops",
      reason: "Moderate risk requires normal escalation handling.",
    };
  }

  return {
    escalated: false,
    priority: "normal",
    routeTo: "ops",
    reason: "No fast escalation required.",
  };
}

export function requiresFastEscalation(
  input: FastEscalationInput
): boolean {
  return resolveFastEscalationPath(input).escalated;
}
