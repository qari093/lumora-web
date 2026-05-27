export type RefundDecision = {
  eligible: boolean;
  refundType: "original_psp" | "refund_credit" | "manual_review";
  amount: number;
  reason: string;
};

export type ChargebackRecord = {
  orderId: string;
  disputedAmount: number;
  liabilityAmount: number;
  status: "review" | "won" | "lost";
  userMessage: string;
};

export function evaluateRefund(purchased: number, spent: number, originalPspAvailable = true): RefundDecision {
  const unspent = Math.max(0, purchased - spent);
  if (unspent <= 0) return { eligible: false, refundType: "manual_review", amount: 0, reason: "fully_spent_manual_review" };
  return {
    eligible: true,
    refundType: originalPspAvailable ? "original_psp" : "refund_credit",
    amount: unspent,
    reason: originalPspAvailable ? "unspent_original_psp" : "psp_unavailable_refund_credit",
  };
}

export function createChargebackRecord(orderId: string, disputedAmount: number, unspentAmount: number): ChargebackRecord {
  return {
    orderId,
    disputedAmount,
    liabilityAmount: Math.max(0, disputedAmount - unspentAmount),
    status: "review",
    userMessage: "A payment for a past pack is under review. We’ll contact you if anything is needed.",
  };
}

export function canUseRefundCredit(useCase: string) {
  return useCase === "zencoin_pack_purchase" || useCase === "subscription_restore";
}
