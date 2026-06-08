import type { LafsAccountSeed, LafsFoundationManifest, LafsPreBetaGuard } from "./types";

export const LAFS_PRE_BETA_GUARDS: LafsPreBetaGuard = {
  paymentLiveMode: false,
  publicSignupDisabled: true,
  allowlistOnly: true,
  manualExpansionOnly: true,
  humanApprovalRequired: true,
};

export const LAFS_ACCOUNT_SEEDS: LafsAccountSeed[] = [
  { code: "cash_eur", name: "Cash EUR", currency: "EUR", type: "asset" },
  { code: "stripe_clearing_eur", name: "Stripe Clearing EUR", currency: "EUR", type: "asset" },
  { code: "zendoro_revenue_eur", name: "Zendoro Revenue EUR", currency: "EUR", type: "revenue" },
  { code: "refund_reserve_eur", name: "Refund Reserve EUR", currency: "EUR", type: "liability" },
  { code: "creator_rewards_eur", name: "Creator Rewards EUR", currency: "EUR", type: "liability" },
  { code: "operations_expense_eur", name: "Operations Expense EUR", currency: "EUR", type: "expense" },
  { code: "treasury_reserve_eur", name: "Treasury Reserve EUR", currency: "EUR", type: "equity" },
  { code: "zencoin_internal_zc", name: "Zencoin Internal", currency: "ZC", type: "liability" },
];

export function createLafsFoundationManifest(now = new Date()): LafsFoundationManifest {
  return {
    system: "LAFS_PRE_BETA",
    status: "FOUNDATION_READY",
    pack: "01/08",
    generatedAt: now.toISOString(),
    guards: LAFS_PRE_BETA_GUARDS,
    accounts: LAFS_ACCOUNT_SEEDS,
    nextPack: "LAFS Pack 02/08 — Ledger Core + Double Entry",
  };
}

export function validateLafsFoundationManifest(manifest: LafsFoundationManifest): boolean {
  return (
    manifest.system === "LAFS_PRE_BETA" &&
    manifest.status === "FOUNDATION_READY" &&
    manifest.pack === "01/08" &&
    manifest.guards.paymentLiveMode === false &&
    manifest.guards.publicSignupDisabled === true &&
    manifest.guards.allowlistOnly === true &&
    manifest.guards.manualExpansionOnly === true &&
    manifest.guards.humanApprovalRequired === true &&
    manifest.accounts.length >= 8 &&
    manifest.accounts.every((account) => account.code.length > 0 && account.name.length > 0)
  );
}
