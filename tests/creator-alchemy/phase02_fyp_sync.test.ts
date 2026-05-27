import { describe, expect, it } from "vitest";
import {
  buildEmotionalAnalyticsSnapshot,
  calculateFeedEmotionalDiversity,
  scoreFypCreatorResonance,
  shouldInjectOppositeConstellation
} from "@/src/core/creator-alchemy/fyp-sync";

describe("Phase 02 — FYP ↔️ Creator Alchemy Synchronization Ω", () => {
  it("scores FYP resonance without boosting burnout", () => {
    const score = scoreFypCreatorResonance({
      creatorId: "creator-1",
      contentId: "content-1",
      rewatchRate: 0.9,
      saveRate: 0.8,
      completionRate: 0.7,
      burnoutRisk: 0.2,
      originality: 0.6,
      constellation: "Midnight Souls"
    });

    expect(score.resonanceScore).toBeGreaterThan(0.7);
    expect(score.feedBoost).toBeGreaterThan(0);
    expect(score.constellationDiscovery).toBe(true);
  });

  it("suppresses feed boost when burnout risk is high", () => {
    const score = scoreFypCreatorResonance({
      creatorId: "creator-1",
      contentId: "content-1",
      rewatchRate: 0.9,
      saveRate: 0.8,
      completionRate: 0.7,
      burnoutRisk: 0.9,
      originality: 0.6,
      constellation: "Midnight Souls"
    });

    expect(score.suppressForBurnout).toBe(true);
    expect(score.feedBoost).toBe(0);
  });

  it("detects low emotional diversity", () => {
    const diversity = calculateFeedEmotionalDiversity([
      { creatorId: "a", contentId: "1", rewatchRate: 0.1, saveRate: 0.1, completionRate: 0.1, burnoutRisk: 0.1, originality: 0.1, constellation: "Midnight Souls" },
      { creatorId: "b", contentId: "2", rewatchRate: 0.1, saveRate: 0.1, completionRate: 0.1, burnoutRisk: 0.1, originality: 0.1, constellation: "Midnight Souls" }
    ]);

    expect(shouldInjectOppositeConstellation(diversity)).toBe(false);
  });

  it("builds emotional analytics snapshots", () => {
    const snapshot = buildEmotionalAnalyticsSnapshot({
      creatorId: "creator-2",
      contentId: "content-2",
      rewatchRate: 0.6,
      saveRate: 0.4,
      completionRate: 0.8,
      burnoutRisk: 0.2,
      originality: 0.7,
      constellation: "Quiet Chaos"
    });

    expect(snapshot.creatorId).toBe("creator-2");
    expect(snapshot.healthScore).toBe(0.8);
    expect(snapshot.whisperLearningWeight).toBe(1);
  });
});
