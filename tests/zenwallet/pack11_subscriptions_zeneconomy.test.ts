import { describe, expect, it } from "vitest";
import { calculateDowngradeGraceExcess, calculateRollover, isPayToWinAllowed, PLANS } from "@/src/core/zenwallet/subscriptions/subscriptionEconomy";

describe("ZenWallet Pack 11 — Subscriptions + ZenEconomy", () => {
  it("defines subscription plans", () => {
    expect(PLANS.plus.monthlyAllowance).toBe(100);
  });

  it("calculates gentle rollover", () => {
    expect(calculateRollover(100, 100)).toBe(20);
  });

  it("handles downgrade grace", () => {
    const result = calculateDowngradeGraceExcess(250, 100);
    expect(result.retained).toBe(200);
    expect(result.excess).toBe(50);
    expect(result.graceDays).toBe(30);
  });

  it("blocks pay-to-win", () => {
    expect(isPayToWinAllowed()).toBe(false);
  });
});
