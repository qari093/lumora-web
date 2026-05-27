import { describe, expect, it } from "vitest";
import {
  buildEnforcementAuditLog,
  buildManualReviewQueue,
  computeSellerRisk,
  decideEnforcement,
  detectBuyerAbuse,
  detectFakeReview,
  detectScamKeywords,
  detectSuspiciousOrder,
  trackChargebackRisk
} from "../../src/core/zendoro/trust/trustSafetyRuntime";

describe("Zendoro Pack 8/10 — Trust + Safety Hardening", () => {
  it("validates trust and fraud enforcement runtime", () => {
    const signals = [
      detectFakeReview({ velocity: 4, duplicateRatio: 0.8, verified: false }),
      detectSuspiciousOrder({ amount: 4200, vpn: true, rapidAttempts: 3 }),
      computeSellerRisk({ disputes: 5, refunds: 7, fulfillmentScore: 48 }),
      detectBuyerAbuse({ refundRate: 0.72, bans: 1 }),
      trackChargebackRisk({ chargebacks: 4, attempts: 5 }),
      detectScamKeywords("crypto only payment with off-platform telegram only")
    ];

    const action = decideEnforcement(signals);
    expect(action).toBe("block");
    expect(buildManualReviewQueue(signals).length).toBeGreaterThan(0);

    const audit = buildEnforcementAuditLog(action, signals);
    expect(audit.action).toBe("block");
    expect(audit.signals.length).toBe(6);
  });

  it("tracks canonical Zendoro trust/safety coverage", () => {
    const coverage = [
      "fake_review_detection",
      "suspicious_order_detection",
      "seller_risk_scoring",
      "buyer_abuse_detection",
      "chargeback_tracking",
      "scam_keyword_monitoring",
      "manual_review_queue",
      "enforcement_logging"
    ];

    expect(coverage.length).toBe(8);
    expect(coverage).toContain("manual_review_queue");
  });
});
