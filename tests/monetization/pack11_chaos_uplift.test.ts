import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { calculateEmotionalTrajectoryEntropy } from "@/src/monetization/chaos-uplift/entropy";
import { calculateNoveltyScore } from "@/src/monetization/chaos-uplift/novelty";
import { isChaosUpliftMature } from "@/src/monetization/chaos-uplift/maturation";
import { allocateChaosUplift } from "@/src/monetization/chaos-uplift/pool";
import { getChaosUpliftCharter } from "@/src/monetization/chaos-uplift/charter";

describe("Monetization Pack11 — Chaos Uplift", () => {
  it("calculates emotional trajectory entropy", () => {
    expect(calculateEmotionalTrajectoryEntropy({
      distinctEmotionalStates: 4,
      totalMoments: 8,
    })).toBe(0.5);
  });

  it("calculates novelty score", () => {
    const score = calculateNoveltyScore({
      visualNovelty: 0.8,
      emotionalEntropy: 0.7,
      predictability: 0.2,
    });

    expect(score).toBeGreaterThan(0.7);
  });

  it("requires seven-day maturation", () => {
    const now = 7 * 86400000;
    expect(isChaosUpliftMature({ createdAtMs: 0, nowMs: now })).toBe(true);
    expect(isChaosUpliftMature({ createdAtMs: 0, nowMs: now - 1 })).toBe(false);
  });

  it("allocates uplift only after maturation", () => {
    expect(allocateChaosUplift({
      totalPool: 100,
      creatorNoveltyScore: 2,
      totalNoveltyScore: 10,
      mature: true,
    })).toBe(20);

    expect(allocateChaosUplift({
      totalPool: 100,
      creatorNoveltyScore: 2,
      totalNoveltyScore: 10,
      mature: false,
    })).toBe(0);
  });

  it("publishes transparent charter", () => {
    const charter = getChaosUpliftCharter();

    expect(charter.published).toBe(true);
    expect(charter.antiGaming).toBe(true);
    expect(fs.existsSync("docs/chaos_uplift_charter.md")).toBe(true);
  });
});
