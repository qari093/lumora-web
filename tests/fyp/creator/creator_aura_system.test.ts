import { describe, expect, it } from "vitest";

import {
  createCreatorProfile
} from "@/src/core/fyp/creator/creatorProfile";

import {
  createAuraProfile,
  calculateAuraTier
} from "@/src/core/fyp/aura/auraEngine";

import {
  getAuraUnlocks
} from "@/src/core/fyp/aura/auraUnlocks";

import {
  createImpactMilestones
} from "@/src/core/fyp/aura/impactMilestones";

describe("Lumora FYP Creator Aura System", () => {
  it("creates creator profile", () => {
    const profile = createCreatorProfile({
      creatorId: "creator_001",
      displayName: "Night Architect",
      primaryMode: "drift",
      now: 100
    });

    expect(profile.verifiedHuman).toBe(true);
  });

  it("calculates aura tier", () => {
    expect(calculateAuraTier(100)).toBe("wire");
    expect(calculateAuraTier(700)).toBe("volt");
    expect(calculateAuraTier(950)).toBe("singularity");
  });

  it("creates aura profile", () => {
    const aura = createAuraProfile({
      creatorId: "creator_001",
      impactQuotient: 1000,
      resonance: 800,
      voltage: 700,
      loyalty: 600,
      trust: 900
    });

    expect(aura.tier).toBe("volt");
  });

  it("returns aura unlocks", () => {
    const unlocks = getAuraUnlocks("singularity");

    expect(unlocks.legendaryContracts).toBe(true);
    expect(unlocks.phantomAccess).toBe(true);
  });

  it("creates impact milestones", () => {
    const milestones = createImpactMilestones({
      creatorId: "creator_001",
      impactQuotient: 1000
    });

    expect(milestones.every(m => m.unlocked)).toBe(true);
  });
});
