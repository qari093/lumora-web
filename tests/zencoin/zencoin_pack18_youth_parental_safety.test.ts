import { describe, expect, it } from "vitest";
import {
  youthSafety,
  canMinorPurchase,
  youthSafetyHealthy
} from "@/core/zencoin/youth/youthParentalSafety";

describe("Zencoin Pack 18 — Youth + Parental Safety", () => {
  it("supports youth safety systems", () => {
    expect(youthSafety.ageGate).toBe(true);
    expect(youthSafety.noYouthTokenEconomy).toBe(true);
  });

  it("requires parental approval for minors", () => {
    expect(canMinorPurchase({ isMinor: true, parentalApproved: false })).toBe(false);
    expect(canMinorPurchase({ isMinor: true, parentalApproved: true })).toBe(true);
    expect(canMinorPurchase({ isMinor: false, parentalApproved: false })).toBe(true);
  });

  it("supports youth safety health", () => {
    expect(youthSafetyHealthy()).toBe(true);
  });
});
