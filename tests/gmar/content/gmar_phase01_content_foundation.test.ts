import { describe, it, expect } from "vitest";

import { ENEMY_ARCHETYPES } from "../../../src/core/gmar/content/enemies/archetypes";
import { BOSS_ROSTER } from "../../../src/core/gmar/content/bosses/bossRoster";
import { BIOMES } from "../../../src/core/gmar/content/biomes/biomes";
import { progressionReward } from "../../../src/core/gmar/content/progression/rewards";
import { onboardingFlow } from "../../../src/core/gmar/content/onboarding";

describe("GMAR PHASE 1", () => {
  it("loads enemy archetypes", () => {
    expect(ENEMY_ARCHETYPES.length).toBeGreaterThan(3);
  });

  it("loads boss roster", () => {
    expect(BOSS_ROSTER[0]).toContain("Oblivion");
  });

  it("loads biome system", () => {
    expect(BIOMES.includes("Frozen Orbit")).toBe(true);
  });

  it("calculates rewards", () => {
    expect(progressionReward(5).reward).toBe(500);
  });

  it("completes onboarding", () => {
    expect(onboardingFlow(6).completed).toBe(true);
  });
});
