import { describe, expect, it } from "vitest";
import {
  CONSTELLATIONS,
  DEFAULT_LUMORA_SHADOW_POLICY,
  calculateAdaptiveDrift,
  canShowcaseShadowWork,
  createBridgeOfTwoWorlds,
  createSilentCollaborationCandidate,
  getOppositeConstellation,
  listConstellations,
  buildDreamChamberState,
  shouldSendSilentPulse
} from "@/src/core/creator-alchemy/constellation";

describe("Creator Alchemy Pack 04 — Constellation System Ω", () => {
  it("locks emotional tribe registry with opposites", () => {
    expect(listConstellations()).toHaveLength(6);
    expect(getOppositeConstellation("midnight_souls").id).toBe("neon_dreamers");
    expect(CONSTELLATIONS.quiet_chaos.opposite).toBe("healing_humor");
  });

  it("calculates adaptive drift from measurable signals", () => {
    const drift = calculateAdaptiveDrift({
      creatorId: "c1",
      current: "midnight_souls",
      ancestral: "midnight_souls",
      toneShift: 0.45,
      audienceMutation: 0.55,
      creatorCuriosity: 0.4
    });

    expect(drift.shouldDrift).toBe(true);
    expect(drift.reasons).toContain("tone_shift");
    expect(drift.reasons).toContain("audience_mutation");
    expect(drift.suggestedExposure).toBeLessThanOrEqual(0.3);
  });

  it("keeps weak drift as light background airflow", () => {
    const drift = calculateAdaptiveDrift({
      creatorId: "c1",
      current: "midnight_souls",
      ancestral: "midnight_souls",
      toneShift: 0.1,
      audienceMutation: 0.1,
      creatorCuriosity: 0.1
    });

    expect(drift.shouldDrift).toBe(false);
    expect(drift.suggestedExposure).toBe(0.05);
  });

  it("requires mutual consent for silent collaboration", () => {
    const allowed = createSilentCollaborationCandidate({
      creatorA: "a",
      creatorB: "b",
      sharedConstellation: "slow_fire",
      emotionalOverlap: 0.8,
      consentA: true,
      consentB: true
    });

    const blocked = createSilentCollaborationCandidate({
      creatorA: "a",
      creatorB: "b",
      sharedConstellation: "slow_fire",
      emotionalOverlap: 0.8,
      consentA: true,
      consentB: false
    });

    expect(allowed.allowed).toBe(true);
    expect(blocked.allowed).toBe(false);
  });

  it("keeps Lumora Shadow private unless creator-approved showcase is safe", () => {
    expect(DEFAULT_LUMORA_SHADOW_POLICY.publicByDefault).toBe(false);
    expect(DEFAULT_LUMORA_SHADOW_POLICY.viralityEligible).toBe(false);

    expect(
      canShowcaseShadowWork({
        creatorApproved: true,
        emotionalSafetyPassed: true,
        publicLabel: "From the constellation’s quiet circle."
      })
    ).toBe(true);
  });

  it("builds Dream Chamber with pre-glow and hidden metrics", () => {
    const preGlow = buildDreamChamberState({ triggerStrength: 0.9, daysUntilEvent: 2, activeNow: false });
    const active = buildDreamChamberState({ triggerStrength: 0.9, daysUntilEvent: 0, activeNow: true });

    expect(preGlow.preGlow).toBe(true);
    expect(active.active).toBe(true);
    expect(active.likesHidden).toBe(true);
    expect(active.commentsHidden).toBe(true);
  });

  it("creates anonymous bridge events between opposite worlds", () => {
    const bridge = createBridgeOfTwoWorlds("midnight_souls", "neon_dreamers", true);

    expect(bridge.active).toBe(true);
    expect(bridge.anonymous).toBe(true);
    expect(bridge.labelHidden).toBe(true);
  });

  it("keeps Silent Pulse rare and optional", () => {
    expect(shouldSendSilentPulse({ enabled: false, daysSinceLastPulse: 30, constellationActivity: 0.8 })).toBe(false);
    expect(shouldSendSilentPulse({ enabled: true, daysSinceLastPulse: 7, constellationActivity: 0.8 })).toBe(false);
    expect(shouldSendSilentPulse({ enabled: true, daysSinceLastPulse: 30, constellationActivity: 0.8 })).toBe(true);
  });
});
