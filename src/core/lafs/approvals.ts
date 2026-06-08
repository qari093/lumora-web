export type LafsApprovalRole = "operator" | "council";
export type LafsApprovalState = "pending" | "partially_approved" | "approved" | "rejected" | "expired";

export interface LafsApprovalRule {
  minAmountMinor: number;
  maxAmountMinor: number | null;
  requiredApprovals: number;
  requiredCouncilApprovals: number;
}

export interface LafsApprovalRequest {
  id: string;
  amountMinor: number;
  requestorId: string;
  state: LafsApprovalState;
  approvals: LafsApprovalDecision[];
  deadlineIso: string;
}

export interface LafsApprovalDecision {
  approverId: string;
  role: LafsApprovalRole;
  approved: boolean;
  decidedAt: string;
}

export const LAFS_APPROVAL_RULES: LafsApprovalRule[] = [
  {
    minAmountMinor: 1,
    maxAmountMinor: 49_999,
    requiredApprovals: 1,
    requiredCouncilApprovals: 0,
  },
  {
    minAmountMinor: 50_000,
    maxAmountMinor: 200_000,
    requiredApprovals: 2,
    requiredCouncilApprovals: 1,
  },
  {
    minAmountMinor: 200_001,
    maxAmountMinor: null,
    requiredApprovals: 3,
    requiredCouncilApprovals: 3,
  },
];

export function getApprovalRule(amountMinor: number): LafsApprovalRule {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new Error("amount_minor_must_be_positive_safe_integer");
  }

  const rule = LAFS_APPROVAL_RULES.find((item) => {
    const belowMax = item.maxAmountMinor === null || amountMinor <= item.maxAmountMinor;
    return amountMinor >= item.minAmountMinor && belowMax;
  });

  if (!rule) throw new Error("approval_rule_not_found");
  return rule;
}

export function createApprovalRequest(input: {
  id: string;
  amountMinor: number;
  requestorId: string;
  nowIso?: string;
  deadlineHours?: number;
}): LafsApprovalRequest {
  const now = new Date(input.nowIso ?? new Date().toISOString());
  const deadline = new Date(now.getTime() + (input.deadlineHours ?? 72) * 60 * 60 * 1000);

  return {
    id: input.id,
    amountMinor: input.amountMinor,
    requestorId: input.requestorId,
    state: "pending",
    approvals: [],
    deadlineIso: deadline.toISOString(),
  };
}

export function applyApprovalDecision(
  request: LafsApprovalRequest,
  decision: LafsApprovalDecision,
  nowIso = new Date().toISOString()
): LafsApprovalRequest {
  if (new Date(nowIso).getTime() > new Date(request.deadlineIso).getTime()) {
    return { ...request, state: "expired" };
  }

  if (request.state === "approved" || request.state === "rejected" || request.state === "expired") {
    return request;
  }

  if (decision.approverId === request.requestorId) {
    throw new Error("self_approval_blocked");
  }

  const alreadyDecided = request.approvals.some((item) => item.approverId === decision.approverId);
  if (alreadyDecided) {
    throw new Error("duplicate_approval_blocked");
  }

  if (!decision.approved) {
    return {
      ...request,
      state: "rejected",
      approvals: [...request.approvals, decision],
    };
  }

  const approvals = [...request.approvals, decision];
  const approvedCount = approvals.filter((item) => item.approved).length;
  const councilCount = approvals.filter((item) => item.approved && item.role === "council").length;
  const rule = getApprovalRule(request.amountMinor);

  const approved =
    approvedCount >= rule.requiredApprovals &&
    councilCount >= rule.requiredCouncilApprovals;

  return {
    ...request,
    state: approved ? "approved" : "partially_approved",
    approvals,
  };
}

export function approvalSummary(request: LafsApprovalRequest): {
  state: LafsApprovalState;
  requiredApprovals: number;
  currentApprovals: number;
  requiredCouncilApprovals: number;
  currentCouncilApprovals: number;
  selfApprovalBlocked: true;
} {
  const rule = getApprovalRule(request.amountMinor);

  return {
    state: request.state,
    requiredApprovals: rule.requiredApprovals,
    currentApprovals: request.approvals.filter((item) => item.approved).length,
    requiredCouncilApprovals: rule.requiredCouncilApprovals,
    currentCouncilApprovals: request.approvals.filter((item) => item.approved && item.role === "council").length,
    selfApprovalBlocked: true,
  };
}
