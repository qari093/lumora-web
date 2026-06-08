export type LafsCurrency = "EUR" | "USD" | "USDC" | "ZC";
export type LafsAccountType = "asset" | "liability" | "equity" | "revenue" | "expense";
export type LafsFreezeState = "SAFE" | "WATCH" | "REVIEW" | "FROZEN";
export type LafsAuditActor = "system" | "operator" | "council" | "stripe" | "zendoro";

export interface LafsAccountSeed {
  code: string;
  name: string;
  currency: LafsCurrency;
  type: LafsAccountType;
}

export interface LafsPreBetaGuard {
  paymentLiveMode: false;
  publicSignupDisabled: true;
  allowlistOnly: true;
  manualExpansionOnly: true;
  humanApprovalRequired: true;
}

export interface LafsFoundationManifest {
  system: "LAFS_PRE_BETA";
  status: "FOUNDATION_READY";
  pack: "01/08";
  generatedAt: string;
  guards: LafsPreBetaGuard;
  accounts: LafsAccountSeed[];
  nextPack: "LAFS Pack 02/08 — Ledger Core + Double Entry";
}
