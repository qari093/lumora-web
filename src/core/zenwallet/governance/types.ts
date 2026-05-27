export type ZenWalletBalanceKind = "zencoin" | "refund_credit";

export type ZenWalletPolicySeverity = "info" | "warning" | "critical";

export type ZenWalletRegionGroup =
  | "eu_eea_uk"
  | "north_america"
  | "latam"
  | "africa"
  | "india_south_asia"
  | "southeast_asia"
  | "middle_east"
  | "unsupported_manual";

export type ZenWalletGovernanceRule = {
  readonly id: string;
  readonly title: string;
  readonly severity: ZenWalletPolicySeverity;
  readonly enforced: boolean;
  readonly description: string;
};

export type ZenWalletPolicyCheck = {
  readonly ok: boolean;
  readonly ruleId: string;
  readonly message: string;
  readonly severity: ZenWalletPolicySeverity;
};

export type ZenWalletTerminology = {
  readonly zencoinName: "Zencoin";
  readonly refundCreditName: "Refund Credit";
  readonly walletName: "ZenWallet";
  readonly ledgerName: "ZenLedger";
  readonly paymentBridgeName: "ZenPay Bridge";
  readonly orderIntentName: "OrderIntent";
};
