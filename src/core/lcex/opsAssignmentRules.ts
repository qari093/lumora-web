export type OpsAssignmentRulesInput = {
  reviewerId: string;
  queueStatus: "open" | "assigned" | "resolved" | "dismissed";
  currentAssignee?: string;
  reviewerCapacity: number;
  reviewerActiveCount: number;
  blocked: boolean;
};

export type OpsAssignmentRulesDecision = {
  assignable: boolean;
  nextStatus: "open" | "assigned" | "resolved" | "dismissed";
  reason:
    | "ok"
    | "reviewer_blocked"
    | "queue_not_open"
    | "already_assigned"
    | "capacity_reached";
};

export function resolveOpsAssignmentRules(
  input: OpsAssignmentRulesInput
): OpsAssignmentRulesDecision {
  if (input.blocked) {
    return {
      assignable: false,
      nextStatus: input.queueStatus,
      reason: "reviewer_blocked",
    };
  }

  if (input.queueStatus !== "open") {
    return {
      assignable: false,
      nextStatus: input.queueStatus,
      reason: "queue_not_open",
    };
  }

  if (input.currentAssignee && input.currentAssignee.trim().length > 0) {
    return {
      assignable: false,
      nextStatus: "assigned",
      reason: "already_assigned",
    };
  }

  if (input.reviewerActiveCount >= Math.max(1, Math.round(input.reviewerCapacity))) {
    return {
      assignable: false,
      nextStatus: "open",
      reason: "capacity_reached",
    };
  }

  return {
    assignable: true,
    nextStatus: "assigned",
    reason: "ok",
  };
}

export function canAssignOpsReview(
  input: OpsAssignmentRulesInput
): boolean {
  return resolveOpsAssignmentRules(input).assignable;
}
