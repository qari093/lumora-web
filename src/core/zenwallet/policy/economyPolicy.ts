import type { ZenWalletBalanceKind, ZenWalletPolicyCheck } from "../governance/types";

export type ZenWalletUseCase =
  | "portal_spend"
  | "gift"
  | "creator_support"
  | "subscription_restore"
  | "zencoin_pack_purchase"
  | "cashout"
  | "investment"
  | "gambling";

export function canUseBalanceForUseCase(balanceKind: ZenWalletBalanceKind, useCase: ZenWalletUseCase): ZenWalletPolicyCheck {
  if (balanceKind === "refund_credit") {
    const allowed = useCase === "subscription_restore" || useCase === "zencoin_pack_purchase";
    return {
      ok: allowed,
      ruleId: "ZW-GOV-003",
      severity: allowed ? "info" : "critical",
      message: allowed
        ? "Refund Credit may be used for this recovery action."
        : "Refund Credit cannot be used for portal spending, gifts, creator support, cashout, gambling, or investment.",
    };
  }

  if (useCase === "cashout" || useCase === "investment" || useCase === "gambling") {
    return {
      ok: false,
      ruleId: "ZW-GOV-001",
      severity: "critical",
      message: "Zencoin cannot be used for cashout, investment, or gambling.",
    };
  }

  return {
    ok: true,
    ruleId: "ZW-GOV-001",
    severity: "info",
    message: "Zencoin use case is allowed by baseline policy.",
  };
}

export function assertNonSpeculativeCopy(copy: string): ZenWalletPolicyCheck {
  const risky = /\b(invest|profit|cash\s*out|withdraw|trade|token\s*price|moon|yield|staking|gamble|bet)\b/i.test(copy);

  return {
    ok: !risky,
    ruleId: "ZW-GOV-001",
    severity: risky ? "critical" : "info",
    message: risky
      ? "Copy contains prohibited speculative, cashout, or gambling language."
      : "Copy is compliant with utility-credit positioning.",
  };
}
