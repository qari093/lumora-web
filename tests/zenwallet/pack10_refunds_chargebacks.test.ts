import { describe, expect, it } from "vitest";
import { canUseRefundCredit, createChargebackRecord, evaluateRefund } from "@/src/core/zenwallet/refunds/refundChargeback";

describe("ZenWallet Pack 10 — Refunds + Chargebacks", () => {
  it("refunds only unspent amount", () => {
    expect(evaluateRefund(100, 30).amount).toBe(70);
    expect(evaluateRefund(100, 100).refundType).toBe("manual_review");
  });

  it("falls back to refund credit when PSP is unavailable", () => {
    expect(evaluateRefund(100, 20, false).refundType).toBe("refund_credit");
  });

  it("hardens refund credit usage", () => {
    expect(canUseRefundCredit("portal_spend")).toBe(false);
    expect(canUseRefundCredit("subscription_restore")).toBe(true);
  });

  it("creates chargeback liability records", () => {
    const record = createChargebackRecord("ord_1", 100, 40);
    expect(record.liabilityAmount).toBe(60);
    expect(record.userMessage).toContain("under review");
  });
});
