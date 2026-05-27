import type { CreatorWalletBalance } from "./types";

export interface PayoutReadiness {
  ready: boolean;
  reason: string;
}

export function evaluatePayoutReadiness(input: {
  balance: CreatorWalletBalance;
  fiatBridgeAllowed: boolean;
  fraudCleared: boolean;
  creatorVerified: boolean;
}): PayoutReadiness {
  if (!input.fiatBridgeAllowed) return { ready: false, reason: "fiat_bridge_locked" };
  if (!input.fraudCleared) return { ready: false, reason: "fraud_not_cleared" };
  if (!input.creatorVerified) return { ready: false, reason: "creator_not_verified" };
  if (!input.balance.payoutReady) return { ready: false, reason: "balance_not_ready" };

  return { ready: true, reason: "payout_ready" };
}
