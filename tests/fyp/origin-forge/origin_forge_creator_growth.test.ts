import { describe, expect, it } from "vitest";

import {
  createOriginForgeWindow,
  evaluateOriginForge
} from "@/src/core/fyp/origin-forge/originForge";

import {
  createForgeSeedPlan
} from "@/src/core/fyp/origin-forge/forgeSeeding";

import {
  createCreatorGrowthMilestones
} from "@/src/core/fyp/creator-growth/growthMilestones";

import {
  calculateSecondWindBoost
} from "@/src/core/fyp/creator-growth/secondWind";

describe("Lumora FYP Origin Forge + Creator Growth", () => {
  it("creates origin forge window", () => {
    const forge = createOriginForgeWindow({
      creatorId: "creator_001",
      firstContentId: "clip_001",
      now: 100
    });

    expect(forge.active).toBe(true);
    expect(forge.seedAudienceSize).toBe(5000);
    expect(forge.expiresAt).toBeGreaterThan(forge.startedAt);
  });

  it("evaluates forge graduation", () => {
    const forge = createOriginForgeWindow({
      creatorId: "creator_001",
      firstContentId: "clip_001",
      now: 100
    });

    const result = evaluateOriginForge({
      window: forge,
      impactQuotient: 300
    });

    expect(result.graduated).toBe(true);
    expect(result.discoveryRowUnlocked).toBe(true);
    expect(result.newConstellationBadge).toBe(true);
  });

  it("creates protected seed plan", () => {
    const plan = createForgeSeedPlan({
      creatorId: "creator_001",
      contentId: "clip_001",
      requestedUsers: 9000
    });

    expect(plan.targetUsers).toBe(5000);
    expect(plan.affinityMatched).toBe(true);
    expect(plan.fairnessProtected).toBe(true);
  });

  it("creates growth milestones", () => {
    const milestones = createCreatorGrowthMilestones({
      impactQuotient: 300,
      followers: 150,
      echoCount: 300
    });

    expect(milestones.every(m => m.unlocked)).toBe(true);
  });

  it("calculates second wind boost", () => {
    const boost = calculateSecondWindBoost({
      creatorId: "creator_001",
      daysSinceJoin: 20,
      recentImpactDrop: true,
      consistentPosting: true
    });

    expect(boost.eligible).toBe(true);
    expect(boost.boostPercent).toBe(20);
  });
});
