import { describe, expect, it } from "vitest";
import { LIVE_ECONOMY_POLICY, validateLiveEconomyPolicy } from "../../src/live/economy/economyPolicy";
import { calculateCreatorResonance } from "../../src/live/economy/creatorResonanceCore";
import { createSyncMultiplier } from "../../src/live/economy/syncMultiplierCore";

describe("Lumora Live Pack 9 — Economy", () => {
  it("locks anti-casino economy policy", () => {
    expect(validateLiveEconomyPolicy(LIVE_ECONOMY_POLICY)).toBe(true);
  });

  it("penalizes rage signals in creator resonance", () => {
    const score = calculateCreatorResonance({
      healthyEngagement: 90,
      retentionQuality: 80,
      moderationTrust: 90,
      rageSignals: 100,
    });

    expect(score).toBeLessThan(50);
  });

  it("creates cooperative room-wide sync multiplier", () => {
    const multiplier = createSyncMultiplier("room-1");
    expect(multiplier.multiplier).toBe(2);
    expect(multiplier.durationSeconds).toBe(30);
  });
});
