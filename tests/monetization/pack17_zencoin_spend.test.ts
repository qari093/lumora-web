import { describe, expect, it } from "vitest";
import { createContentBoost } from "@/src/monetization/zencoin-spend/boost";
import { createAiSpendAction } from "@/src/monetization/zencoin-spend/aiActions";
import { unlockPremiumFeature } from "@/src/monetization/zencoin-spend/premium";
import { spendZenForAdSkip } from "@/src/monetization/zencoin-spend/adSkip";
import { validateZencoinSpendLayer } from "@/src/monetization/zencoin-spend/system";

describe("Monetization Pack17 — Zencoin Spend Layer", () => {
  it("creates active content boost", () => {
    const boost = createContentBoost({
      userId: "u1",
      contentId: "c1",
      zenCost: 20,
      durationHours: 24,
    });

    expect(boost.boostActive).toBe(true);
  });

  it("allows AI spend action with enough balance", () => {
    const action = createAiSpendAction({
      action: "hero_image",
      balance: 20,
    });

    expect(action.allowed).toBe(true);
    expect(action.remaining).toBe(10);
  });

  it("unlocks premium feature with enough balance", () => {
    const unlock = unlockPremiumFeature({
      feature: "memory_replay",
      balance: 20,
    });

    expect(unlock.unlocked).toBe(true);
    expect(unlock.remaining).toBe(5);
  });

  it("allows protected-state free ad skip", () => {
    const skip = spendZenForAdSkip({
      balance: 0,
      userState: "red",
    });

    expect(skip.allowed).toBe(true);
    expect(skip.cost).toBe(0);
  });

  it("validates full spend layer", () => {
    const result = validateZencoinSpendLayer({
      userId: "u1",
      contentId: "c1",
      balance: 50,
    });

    expect(result.ok).toBe(true);
    expect(result.boost.boostActive).toBe(true);
  });
});
