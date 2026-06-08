export interface LafsTreasuryAllocationRule {
  version: number;
  effectiveFrom: string;
  operationsPct: number;
  reservePct: number;
  growthPct: number;
  creatorRewardsPct: number;
  emergencyBufferPct: number;
  approvedBy: string[];
  supersededAt?: string | null;
}

export interface LafsAllocationSplit {
  operationsMinor: number;
  reserveMinor: number;
  growthMinor: number;
  creatorRewardsMinor: number;
  emergencyBufferMinor: number;
  remainderMinor: number;
}

export const LAFS_DEFAULT_TREASURY_ALLOCATION_RULE: LafsTreasuryAllocationRule = {
  version: 1,
  effectiveFrom: "2026-06-07T00:00:00.000Z",
  operationsPct: 45,
  reservePct: 25,
  growthPct: 15,
  creatorRewardsPct: 10,
  emergencyBufferPct: 5,
  approvedBy: ["pre_beta_constitution"],
  supersededAt: null,
};

export function allocationTotalPct(rule: LafsTreasuryAllocationRule): number {
  return (
    rule.operationsPct +
    rule.reservePct +
    rule.growthPct +
    rule.creatorRewardsPct +
    rule.emergencyBufferPct
  );
}

export function validateTreasuryAllocationRule(rule: LafsTreasuryAllocationRule): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Number.isInteger(rule.version) || rule.version <= 0) errors.push("invalid_version");
  if (!rule.effectiveFrom || Number.isNaN(new Date(rule.effectiveFrom).getTime())) errors.push("invalid_effective_from");
  if (!Array.isArray(rule.approvedBy) || rule.approvedBy.length < 1) errors.push("approval_required");

  const pctFields = [
    ["operationsPct", rule.operationsPct],
    ["reservePct", rule.reservePct],
    ["growthPct", rule.growthPct],
    ["creatorRewardsPct", rule.creatorRewardsPct],
    ["emergencyBufferPct", rule.emergencyBufferPct],
  ] as const;

  for (const [key, value] of pctFields) {
    if (!Number.isFinite(value) || value < 0 || value > 100) errors.push(`invalid_pct:${key}`);
  }

  if (allocationTotalPct(rule) !== 100) errors.push("allocation_total_must_equal_100");

  return { ok: errors.length === 0, errors };
}

export function allocateTreasury(amountMinor: number, rule = LAFS_DEFAULT_TREASURY_ALLOCATION_RULE): LafsAllocationSplit {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    throw new Error("amount_minor_must_be_non_negative_safe_integer");
  }

  const validation = validateTreasuryAllocationRule(rule);
  if (!validation.ok) throw new Error(`invalid_allocation_rule:${validation.errors.join(",")}`);

  const operationsMinor = Math.floor((amountMinor * rule.operationsPct) / 100);
  const reserveMinor = Math.floor((amountMinor * rule.reservePct) / 100);
  const growthMinor = Math.floor((amountMinor * rule.growthPct) / 100);
  const creatorRewardsMinor = Math.floor((amountMinor * rule.creatorRewardsPct) / 100);
  const emergencyBufferMinor = Math.floor((amountMinor * rule.emergencyBufferPct) / 100);

  const allocated =
    operationsMinor +
    reserveMinor +
    growthMinor +
    creatorRewardsMinor +
    emergencyBufferMinor;

  return {
    operationsMinor,
    reserveMinor,
    growthMinor,
    creatorRewardsMinor,
    emergencyBufferMinor,
    remainderMinor: amountMinor - allocated,
  };
}

export function createFinancialConstitutionView(input?: {
  allocationRule?: LafsTreasuryAllocationRule;
}) {
  const allocationRule = input?.allocationRule ?? LAFS_DEFAULT_TREASURY_ALLOCATION_RULE;

  return {
    status: "FINANCIAL_CONSTITUTION_ACTIVE",
    sections: {
      treasuryAllocation: allocationRule,
      approvalGovernance: {
        selfApprovalBlocked: true,
        humanApprovalRequired: true,
        highValueCouncilRequired: true,
      },
      riskGovernance: {
        highRiskFreezesAffectedSource: true,
        criticalRiskFreezesTreasurySegment: true,
        unfreezeRequiresEvidence: true,
      },
      betaGuards: {
        paymentLiveMode: false,
        publicSignupDisabled: true,
        allowlistOnly: true,
      },
    },
  };
}

export function createConstitutionDiff(oldRule: LafsTreasuryAllocationRule, newRule: LafsTreasuryAllocationRule) {
  const fields = [
    "operationsPct",
    "reservePct",
    "growthPct",
    "creatorRewardsPct",
    "emergencyBufferPct",
  ] as const;

  return {
    oldVersion: oldRule.version,
    newVersion: newRule.version,
    changes: fields
      .filter((field) => oldRule[field] !== newRule[field])
      .map((field) => ({
        field,
        before: oldRule[field],
        after: newRule[field],
      })),
    requiresCouncilApproval: true,
  };
}
