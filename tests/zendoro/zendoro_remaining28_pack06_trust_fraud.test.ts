import { describe, expect, it } from "vitest";
import { scoreZendoroSellerRisk, validateZendoroTrustFraudGuards, zendoroTrustFraudGuards } from "@/src/lib/zendoro/remaining28/trustFraud";

describe("Zendoro Remaining 28% Pack 6/9 — Trust Fraud", () => {
  it("locks trust and fraud requirements", () => {
    expect(validateZendoroTrustFraudGuards()).toBe(true);
    expect(zendoroTrustFraudGuards.manualReviewQueue).toBe(true);
    expect(zendoroTrustFraudGuards.enforcementLogging).toBe(true);
  });

  it("scores seller risk", () => {
    expect(scoreZendoroSellerRisk({ disputes: 1, chargebacks: 1, fakeReviews: 1 })).toBe(60);
  });
});
