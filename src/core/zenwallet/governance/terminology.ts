import type { ZenWalletTerminology } from "./types";

export const ZENWALLET_TERMINOLOGY: ZenWalletTerminology = {
  zencoinName: "Zencoin",
  refundCreditName: "Refund Credit",
  walletName: "ZenWallet",
  ledgerName: "ZenLedger",
  paymentBridgeName: "ZenPay Bridge",
  orderIntentName: "OrderIntent",
} as const;

export function assertCanonicalZenWalletTerm(term: string): boolean {
  return Object.values(ZENWALLET_TERMINOLOGY).includes(term as never);
}
