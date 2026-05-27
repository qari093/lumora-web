import type { ZenWalletGovernanceRule } from "./types";

export const ZENWALLET_GOVERNANCE_RULES: readonly ZenWalletGovernanceRule[] = [
  {
    id: "ZW-GOV-001",
    title: "Zencoin utility-only classification",
    severity: "critical",
    enforced: true,
    description: "Zencoin must remain an internal non-cash, non-withdrawable platform utility credit.",
  },
  {
    id: "ZW-GOV-002",
    title: "No portal direct balance mutation",
    severity: "critical",
    enforced: true,
    description: "All portal spending must route through ZenWallet entitlement and authorization checks.",
  },
  {
    id: "ZW-GOV-003",
    title: "Refund Credit isolation",
    severity: "critical",
    enforced: true,
    description: "Refund Credit may only restore subscriptions or buy new Zencoin packs.",
  },
  {
    id: "ZW-GOV-004",
    title: "Creator earnings separation",
    severity: "critical",
    enforced: true,
    description: "Creator payouts must remain separate from consumer Zencoin and Refund Credit.",
  },
  {
    id: "ZW-GOV-005",
    title: "Anti-gambling economy doctrine",
    severity: "critical",
    enforced: true,
    description: "ZenWallet must not power gambling loops, casino presentation, or pay-to-win mechanics.",
  },
  {
    id: "ZW-GOV-006",
    title: "Exact-once settlement",
    severity: "critical",
    enforced: true,
    description: "Every PSP settlement must bind to one OrderIntent and credit exactly once.",
  },
  {
    id: "ZW-GOV-007",
    title: "External verification",
    severity: "critical",
    enforced: true,
    description: "Daily integrity roots must be externally anchored and verifiable in-app.",
  },
  {
    id: "ZW-GOV-008",
    title: "Offline certificate safety",
    severity: "critical",
    enforced: true,
    description: "Offline spending must use signed certificates, sequence numbers, and encrypted journals.",
  },
  {
    id: "ZW-GOV-009",
    title: "FX and DCC transparency",
    severity: "critical",
    enforced: true,
    description: "Checkout must show exact EUR charge, local estimate range, and DCC warning.",
  },
  {
    id: "ZW-GOV-010",
    title: "Chargeback liability handling",
    severity: "critical",
    enforced: true,
    description: "Chargebacks must create review/liability entries without destructive ledger mutation.",
  },
] as const;

export function getZenWalletGovernanceRule(ruleId: string): ZenWalletGovernanceRule | undefined {
  return ZENWALLET_GOVERNANCE_RULES.find((rule) => rule.id === ruleId);
}

export function validateZenWalletGovernanceRules(): { ok: boolean; missingCritical: string[] } {
  const missingCritical = ZENWALLET_GOVERNANCE_RULES
    .filter((rule) => rule.severity === "critical" && !rule.enforced)
    .map((rule) => rule.id);

  return { ok: missingCritical.length === 0, missingCritical };
}
