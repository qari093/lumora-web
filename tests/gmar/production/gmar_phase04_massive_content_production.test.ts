import { describe, expect, it } from "vitest";
import {
  calculateReplayHighlightScore,
  estimateMissionVolume,
  gmarContentModes,
  resolveContentMode,
  validateGmarMassiveContentProduction,
  validateUgcSubmission
} from "../../../src/core/gmar/production/content/massiveContentProduction";

describe("GMAR Production Phase 4 — Massive Content Production", () => {
  it("validates massive content production contract", () => {
    expect(validateGmarMassiveContentProduction()).toBe(true);
    expect(gmarContentModes).toContain("seasonal");
    expect(gmarContentModes).toContain("ranked");
  });

  it("estimates scalable mission volume", () => {
    const volume = estimateMissionVolume(80, 4);

    expect(volume.scalable).toBe(true);
    expect(volume.totalVariants).toBe(320);
  });

  it("resolves content modes safely", () => {
    expect(resolveContentMode("ranked").competitive).toBe(true);
    expect(resolveContentMode("story").repeatable).toBe(false);
    expect(resolveContentMode("daily").rewardsEnabled).toBe(true);
  });

  it("validates UGC submissions", () => {
    expect(validateUgcSubmission({ creatorId: "c1", hasLicenseProof: true, safeRating: 95 }).ok).toBe(true);
    expect(validateUgcSubmission({ creatorId: "c1", hasLicenseProof: false, safeRating: 95 }).reason).toBe("license_required");
    expect(validateUgcSubmission({ hasLicenseProof: true, safeRating: 95 }).reason).toBe("creator_required");
  });

  it("calculates replay highlight score", () => {
    expect(calculateReplayHighlightScore({ skill: 100, rarity: 80, teamwork: 50 })).toBe(83);
  });
});
