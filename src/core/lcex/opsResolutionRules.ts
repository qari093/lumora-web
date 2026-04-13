export type OpsResolutionRulesInput = {
  queueStatus: "open" | "assigned" | "resolved" | "dismissed";
  actionTaken: boolean;
  noteAdded: boolean;
  reviewerId?: string;
  blocked: boolean;
};

export type OpsResolutionRulesDecision = {
  resolvable: boolean;
  nextStatus: "open" | "assigned" | "resolved" | "dismissed";
  reason:
    | "ok"
    | "reviewer_blocked"
    | "queue_not_actionable"
    | "missing_action"
    | "missing_note"
    | "missing_reviewer";
};

export function resolveOpsResolutionRules(
  input: OpsResolutionRulesInput
): OpsResolutionRulesDecision {
  if (input.blocked) {
    return {
      resolvable: false,
      nextStatus: input.queueStatus,
      reason: "reviewer_blocked",
    };
  }

  if (input.queueStatus !== "assigned" && input.queueStatus !== "open") {
    return {
      resolvable: false,
      nextStatus: input.queueStatus,
      reason: "queue_not_actionable",
    };
  }

  if (!input.reviewerId || input.reviewerId.trim().length === 0) {
    return {
      resolvable: false,
      nextStatus: "assigned",
      reason: "missing_reviewer",
    };
  }

  if (!input.actionTaken) {
    return {
      resolvable: false,
      nextStatus: "assigned",
      reason: "missing_action",
    };
  }

  if (!input.noteAdded) {
    return {
      resolvable: false,
      nextStatus: "assigned",
      reason: "missing_note",
    };
  }

  return {
    resolvable: true,
    nextStatus: "resolved",
    reason: "ok",
  };
}

export function canResolveOpsReview(
  input: OpsResolutionRulesInput
): boolean {
  return resolveOpsResolutionRules(input).resolvable;
}
