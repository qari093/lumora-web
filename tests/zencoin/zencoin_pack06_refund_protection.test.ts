import { describe, expect, it } from "vitest";
import {
  refundProtection,
  shouldDelaySettlement,
  refundProtectionHealthy
} from "@/core/zencoin/refunds/refundProtection";

describe("Zencoin Pack 06 — Refund Protection", () => {
  it("supports protection", () => {
    expect(refundProtection.riskScoring).toBe(true);
  });

  it("delays only risky settlements", () => {
    expect(
      shouldDelaySettlement({
        newDevice: false,
        refundHistory: false,
        unusualVelocity: false
      })
    ).toBe(false);

    expect(
      shouldDelaySettlement({
        newDevice: true,
        refundHistory: false,
        unusualVelocity: false
      })
    ).toBe(true);
  });

  it("supports refund health", () => {
    expect(refundProtectionHealthy()).toBe(true);
  });
});
