export type LafsRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type LafsFreezeState = "SAFE" | "WATCH" | "REVIEW" | "FROZEN";
export type LafsReconciliationSource =
  | "stripe_vs_ledger"
  | "payout_vs_bank"
  | "zencoin_vs_chain"
  | "ledger_vs_custody";

export interface LafsReconciliationCheck {
  source: LafsReconciliationSource;
  sourceAMinor: number;
  sourceBMinor: number;
  toleranceMinor: number;
}

export interface LafsReconciliationResult {
  source: LafsReconciliationSource;
  ok: boolean;
  deltaMinor: number;
  toleranceMinor: number;
  riskLevel: LafsRiskLevel;
  freezeState: LafsFreezeState;
  autoFreeze: boolean;
}

export interface LafsRiskEscalationRule {
  riskLevel: LafsRiskLevel;
  freezeState: LafsFreezeState;
  autoFreeze: boolean;
  notifyRoles: Array<"operator" | "council">;
  requireApprovalToClear: boolean;
}

export const LAFS_RISK_ESCALATION_RULES: LafsRiskEscalationRule[] = [
  {
    riskLevel: "LOW",
    freezeState: "SAFE",
    autoFreeze: false,
    notifyRoles: ["operator"],
    requireApprovalToClear: false,
  },
  {
    riskLevel: "MEDIUM",
    freezeState: "WATCH",
    autoFreeze: false,
    notifyRoles: ["operator"],
    requireApprovalToClear: false,
  },
  {
    riskLevel: "HIGH",
    freezeState: "REVIEW",
    autoFreeze: true,
    notifyRoles: ["operator", "council"],
    requireApprovalToClear: true,
  },
  {
    riskLevel: "CRITICAL",
    freezeState: "FROZEN",
    autoFreeze: true,
    notifyRoles: ["operator", "council"],
    requireApprovalToClear: true,
  },
];

export function resolveRiskEscalation(riskLevel: LafsRiskLevel): LafsRiskEscalationRule {
  const rule = LAFS_RISK_ESCALATION_RULES.find((item) => item.riskLevel === riskLevel);
  if (!rule) throw new Error(`risk_rule_not_found:${riskLevel}`);
  return rule;
}

export function classifyReconciliationRisk(deltaMinor: number, toleranceMinor: number): LafsRiskLevel {
  if (!Number.isSafeInteger(deltaMinor) || deltaMinor < 0) {
    throw new Error("delta_minor_must_be_non_negative_safe_integer");
  }

  if (!Number.isSafeInteger(toleranceMinor) || toleranceMinor < 0) {
    throw new Error("tolerance_minor_must_be_non_negative_safe_integer");
  }

  if (deltaMinor <= toleranceMinor) return "LOW";
  if (deltaMinor <= Math.max(toleranceMinor * 5, 100)) return "MEDIUM";
  if (deltaMinor <= Math.max(toleranceMinor * 20, 5_000)) return "HIGH";
  return "CRITICAL";
}

export function reconcileSources(check: LafsReconciliationCheck): LafsReconciliationResult {
  if (!Number.isSafeInteger(check.sourceAMinor) || !Number.isSafeInteger(check.sourceBMinor)) {
    throw new Error("reconciliation_sources_must_use_minor_units");
  }

  if (!Number.isSafeInteger(check.toleranceMinor) || check.toleranceMinor < 0) {
    throw new Error("tolerance_minor_must_be_non_negative_safe_integer");
  }

  const deltaMinor = Math.abs(check.sourceAMinor - check.sourceBMinor);
  const riskLevel = classifyReconciliationRisk(deltaMinor, check.toleranceMinor);
  const escalation = resolveRiskEscalation(riskLevel);

  return {
    source: check.source,
    ok: deltaMinor <= check.toleranceMinor,
    deltaMinor,
    toleranceMinor: check.toleranceMinor,
    riskLevel,
    freezeState: escalation.freezeState,
    autoFreeze: escalation.autoFreeze,
  };
}

export function shouldFreezePayouts(result: LafsReconciliationResult): boolean {
  return result.autoFreeze && (result.freezeState === "REVIEW" || result.freezeState === "FROZEN");
}

export function createRiskFlag(input: {
  result: LafsReconciliationResult;
  detectedAt?: string;
  owner?: string;
}): {
  severity: LafsRiskLevel;
  source: LafsReconciliationSource;
  freezeState: LafsFreezeState;
  autoFreeze: boolean;
  owner: string;
  detectedAt: string;
  requiresHumanClearance: boolean;
} {
  const escalation = resolveRiskEscalation(input.result.riskLevel);

  return {
    severity: input.result.riskLevel,
    source: input.result.source,
    freezeState: input.result.freezeState,
    autoFreeze: input.result.autoFreeze,
    owner: input.owner ?? "finance_operator",
    detectedAt: input.detectedAt ?? new Date().toISOString(),
    requiresHumanClearance: escalation.requireApprovalToClear,
  };
}
