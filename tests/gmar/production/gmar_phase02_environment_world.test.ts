import { describe, expect, it } from "vitest";
import {
  calculateWorldStreamingBudget,
  createExplorationReward,
  gmarBiomes,
  resolveBiomeHazard,
  validateGmarWorldProduction
} from "../../../src/core/gmar/production/world/environmentWorld";

describe("GMAR Production Phase 2 — Environment & World Production", () => {
  it("validates world production contract", () => {
    expect(validateGmarWorldProduction()).toBe(true);
    expect(gmarBiomes.length).toBeGreaterThanOrEqual(9);
  });

  it("resolves biome hazards", () => {
    expect(resolveBiomeHazard("desert")).toBe("heat_wave");
    expect(resolveBiomeHazard("storm")).toBe("lightning_surge");
    expect(resolveBiomeHazard("dream")).toBe("reality_shift");
  });

  it("calculates streaming budget safely", () => {
    expect(calculateWorldStreamingBudget(9).memorySafe).toBe(true);
    expect(calculateWorldStreamingBudget(9).shardCount).toBe(3);
    expect(calculateWorldStreamingBudget(2).prefetchRadius).toBe(1);
  });

  it("creates exploration rewards", () => {
    expect(createExplorationReward(true, 4).rewardScore).toBe(100);
    expect(createExplorationReward(false, 4).eligible).toBe(false);
  });
});
