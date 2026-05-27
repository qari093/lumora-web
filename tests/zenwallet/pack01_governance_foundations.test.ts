import { describe, expect, it } from "vitest";
import { assertCanonicalZenWalletTerm } from "@/src/core/zenwallet/governance/terminology";
import { ZENWALLET_GOVERNANCE_RULES, validateZenWalletGovernanceRules } from "@/src/core/zenwallet/governance/rules";
import { canUseBalanceForUseCase, assertNonSpeculativeCopy } from "@/src/core/zenwallet/policy/economyPolicy";
import { getZenWalletRegionPolicy } from "@/src/core/zenwallet/compliance/regionPolicy";
import { buildZenWalletFoundationReport } from "@/src/core/zenwallet/governance/foundationReport";

describe("ZenWallet Pack 01 — Governance + Economic Foundations", () => {
  it("locks canonical terminology", () => {
    expect(assertCanonicalZenWalletTerm("ZenWallet")).toBe(true);
    expect(assertCanonicalZenWalletTerm("ZenPay Bridge")).toBe(true);
    expect(assertCanonicalZenWalletTerm("Crypto Wallet")).toBe(false);
  });

  it("enforces all critical governance rules", () => {
    expect(ZENWALLET_GOVERNANCE_RULES.length).toBeGreaterThanOrEqual(10);
    expect(validateZenWalletGovernanceRules().ok).toBe(true);
  });

  it("blocks Refund Credit from portal spending", () => {
    const check = canUseBalanceForUseCase("refund_credit", "portal_spend");
    expect(check.ok).toBe(false);
    expect(check.ruleId).toBe("ZW-GOV-003");
  });

  it("allows Refund Credit only for recovery actions", () => {
    expect(canUseBalanceForUseCase("refund_credit", "zencoin_pack_purchase").ok).toBe(true);
    expect(canUseBalanceForUseCase("refund_credit", "subscription_restore").ok).toBe(true);
    expect(canUseBalanceForUseCase("refund_credit", "gift").ok).toBe(false);
  });

  it("blocks speculative or gambling copy", () => {
    expect(assertNonSpeculativeCopy("Buy Zencoin to invest and profit").ok).toBe(false);
    expect(assertNonSpeculativeCopy("Use Zencoin for calm portal enhancements").ok).toBe(true);
  });

  it("defines unsupported region fallback to manual invoice", () => {
    const policy = getZenWalletRegionPolicy("unsupported_manual");
    expect(policy.fallback).toBe("manual_invoice");
    expect(policy.preferredPsps.length).toBe(0);
  });

  it("builds foundation report", () => {
    const report = buildZenWalletFoundationReport(new Date("2026-05-24T00:00:00.000Z"));
    expect(report.ok).toBe(true);
    expect(report.doctrine).toBe("ZenWallet Flawless Global Ω∞");
    expect(report.regions).toBeGreaterThanOrEqual(8);
  });
});
