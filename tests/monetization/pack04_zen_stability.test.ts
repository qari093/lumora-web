import { describe, expect, it } from "vitest";
import { calculateZenScoreDecay, calculateRecentWeightedZenScore } from "@/src/monetization/zen/decay";
import { calculateLegacyBonus } from "@/src/monetization/zen/legacy";
import { calculateStabilityReward } from "@/src/monetization/zen/stabilityReserve";
import { calculateZenBurn } from "@/src/monetization/zen/burn";
import { validateZenStabilitySystem } from "@/src/monetization/zen/balanceSystem";

describe("Monetization Pack04 — Zen Stability", () => {
  it("decays ZenScore over inactivity", () => {
    const fresh = calculateZenScoreDecay({ currentScore: 1, daysInactive: 0 });
    const decayed = calculateZenScoreDecay({ currentScore: 1, daysInactive: 90 });

    expect(fresh).toBe(1);
    expect(decayed).toBeLessThan(1);
  });

  it("weights recent behavior above historical score", () => {
    const score = calculateRecentWeightedZenScore({
      recentScore: 1,
      historicalScore: 0,
    });

    expect(score).toBe(0.8);
  });

  it("adds small legacy bonus without ossifying privilege", () => {
    const bonus = calculateLegacyBonus({
      accountAgeDays: 3650,
      positiveContributionDays: 3650,
    });

    expect(bonus).toBeLessThanOrEqual(0.1);
    expect(bonus).toBeGreaterThan(0);
  });

  it("adds counter-cyclical stability reward during revenue dip", () => {
    const reward = calculateStabilityReward({
      revenuePerUser: 0.02,
      targetRevenuePerUser: 0.05,
      reserveBalance: 100,
    });

    expect(reward).toBeGreaterThan(0);
  });

  it("burns part of Zen spend", () => {
    const burn = calculateZenBurn({ spendAmount: 100, burnRate: 0.08 });

    expect(burn.burned).toBe(8);
    expect(burn.platformAmount).toBe(92);
  });

  it("validates full Zen stability system", () => {
    const result = validateZenStabilitySystem({
      currentScore: 1,
      daysInactive: 30,
      recentScore: 0.8,
      historicalScore: 0.6,
      accountAgeDays: 100,
      positiveContributionDays: 50,
      revenuePerUser: 0.02,
      targetRevenuePerUser: 0.05,
      reserveBalance: 100,
      spendAmount: 50,
    });

    expect(result.ok).toBe(true);
    expect(result.burn.burned).toBeGreaterThan(0);
  });
});
