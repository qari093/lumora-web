import { describe, expect, it } from "vitest";
import { rewardReveal } from "@/src/core/gmar-cohesion/rewards/rewardReveal";
import { rewardValidator } from "@/src/core/gmar-cohesion/rewards/rewardValidator";
import { zencoinRewardBoundary } from "@/src/core/gmar-cohesion/rewards/zencoinRewardBoundary";

describe("gmar reward cohesion", () => {
  it("reveals rewards ethically", () => {
    expect(rewardReveal(5).nonGambling).toBe(true);
  });

  it("validates capped reward", () => {
    expect(rewardValidator(25).valid).toBe(true);
  });

  it("prevents pay to win", () => {
    expect(zencoinRewardBoundary.noPayToWin).toBe(true);
  });
});
