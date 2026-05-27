import { ZENWALLET_GOVERNANCE_RULES, validateZenWalletGovernanceRules } from "./rules";
import { ZENWALLET_TERMINOLOGY } from "./terminology";
import { ZENWALLET_REGION_POLICIES } from "../compliance/regionPolicy";

export type ZenWalletFoundationReport = {
  readonly ok: boolean;
  readonly generatedAt: string;
  readonly doctrine: "ZenWallet Flawless Global Ω∞";
  readonly rules: number;
  readonly enforcedCriticalRules: number;
  readonly regions: number;
  readonly terminology: typeof ZENWALLET_TERMINOLOGY;
  readonly missingCritical: readonly string[];
};

export function buildZenWalletFoundationReport(now = new Date()): ZenWalletFoundationReport {
  const validation = validateZenWalletGovernanceRules();
  const enforcedCriticalRules = ZENWALLET_GOVERNANCE_RULES.filter(
    (rule) => rule.severity === "critical" && rule.enforced,
  ).length;

  return {
    ok: validation.ok,
    generatedAt: now.toISOString(),
    doctrine: "ZenWallet Flawless Global Ω∞",
    rules: ZENWALLET_GOVERNANCE_RULES.length,
    enforcedCriticalRules,
    regions: ZENWALLET_REGION_POLICIES.length,
    terminology: ZENWALLET_TERMINOLOGY,
    missingCritical: validation.missingCritical,
  };
}
