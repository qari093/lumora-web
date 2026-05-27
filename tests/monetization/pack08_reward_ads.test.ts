import { describe, expect, it } from "vitest";
import { buildRewardAdOptIn } from "@/src/monetization/reward-ads/optIn";
import { calculateRewardAdPayout } from "@/src/monetization/reward-ads/payout";
import { rewardAdCooldownPassed } from "@/src/monetization/reward-ads/cooldown";
import { createRewardAdEvent } from "@/src/monetization/reward-ads/tracking";
import { evaluateRewardAdFlow } from "@/src/monetization/reward-ads/flow";

describe("Monetization Pack08 — Reward Ads", () => {
  it("shows reward ad opt-in only in green state", () => {
    expect(buildRewardAdOptIn({ eligible: true, userState: "green" }).visible).toBe(true);
    expect(buildRewardAdOptIn({ eligible: true, userState: "yellow" }).visible).toBe(false);
    expect(buildRewardAdOptIn({ eligible: true, userState: "red" }).visible).toBe(false);
  });

  it("pays only after completion", () => {
    expect(calculateRewardAdPayout({ completed: true }).amount).toBe(5);
    expect(calculateRewardAdPayout({ completed: false }).amount).toBe(0);
  });

  it("enforces cooldown", () => {
    const now = 1000000;
    expect(rewardAdCooldownPassed({ now })).toBe(true);
    expect(rewardAdCooldownPassed({ lastRewardAdAt: now, now })).toBe(false);
    expect(rewardAdCooldownPassed({ lastRewardAdAt: 0, now })).toBe(true);
  });

  it("tracks reward ad events", () => {
    const event = createRewardAdEvent({
      eventType: "reward_ad.completed",
      adId: "ad1",
      userId: "u1",
      rewardZen: 5,
      timestamp: "2026-05-05T00:00:00.000Z",
    });

    expect(event.eventType).toBe("reward_ad.completed");
    expect(event.rewardZen).toBe(5);
    expect(event.timestamp).toBe("2026-05-05T00:00:00.000Z");
  });

  it("validates full reward ad flow", () => {
    const result = evaluateRewardAdFlow({
      eligible: true,
      userState: "green",
      now: Date.now(),
      completed: true,
    });

    expect(result.canOffer).toBe(true);
    expect(result.payout.amount).toBeGreaterThan(0);
  });
});
