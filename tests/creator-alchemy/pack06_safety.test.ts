import { describe, expect, it } from "vitest";
import {
  activateSanctuaryDay,
  assessEmotionalOverload,
  calculateSoftDecay,
  decideRecoveryMode,
  selectSimilarCreators
} from "@/src/core/creator-alchemy/safety";

describe("Creator Alchemy Pack 06 — Anti-Burnout & Safety Ω", () => {
  it("keeps active creators normal", () => {
    const decision = decideRecoveryMode({
      creatorId: "c1",
      daysSincePost: 1,
      recentPostFrequency: 4,
      emotionalLoad: 0.2,
      sanctuaryRequested: false
    });

    expect(decision.state).toBe("active");
    expect(decision.notificationMode).toBe("normal");
  });

  it("protects creators in recovery mode", () => {
    const decision = decideRecoveryMode({
      creatorId: "c1",
      daysSincePost: 30,
      recentPostFrequency: 0,
      emotionalLoad: 0.7,
      sanctuaryRequested: false
    });

    expect(decision.state).toBe("recovering");
    expect(decision.notificationMode).toBe("quiet");
    expect(decision.preserveSeed).toBe(true);
    expect(decision.substituteSimilarCreators).toBe(true);
  });

  it("activates sanctuary day without guilt pressure", () => {
    const sanctuary = activateSanctuaryDay(true);
    expect(sanctuary.active).toBe(true);
    expect(sanctuary.notificationMode).toBe("silent");
    expect(sanctuary.message).toContain("quiet day");
  });

  it("calculates soft decay safely", () => {
    expect(calculateSoftDecay(1000, 0.25)).toBe(250);
    expect(calculateSoftDecay(1000, 2)).toBe(1000);
    expect(calculateSoftDecay(-1000, 0.5)).toBe(0);
  });

  it("detects emotional overload and suppresses rituals", () => {
    const overload = assessEmotionalOverload({
      insightsShownThisWeek: 2,
      ritualsShownThisMonth: 4,
      atmospheresShownThisWeek: 2,
      creatorDismissals: 0
    });

    expect(overload.level).toBe("reduce");
    expect(overload.suppressRituals).toBe(true);
  });

  it("pauses emotional systems after repeated dismissals", () => {
    const overload = assessEmotionalOverload({
      insightsShownThisWeek: 1,
      ritualsShownThisMonth: 1,
      atmospheresShownThisWeek: 1,
      creatorDismissals: 3
    });

    expect(overload.level).toBe("pause");
    expect(overload.suppressInsights).toBe(true);
    expect(overload.suppressRituals).toBe(true);
  });

  it("selects safe similar creators to keep feed alive", () => {
    const selected = selectSimilarCreators([
      { creatorId: "a", emotionalSimilarity: 0.9, freshness: 0.5, safetyPassed: true },
      { creatorId: "b", emotionalSimilarity: 0.3, freshness: 1, safetyPassed: true },
      { creatorId: "c", emotionalSimilarity: 0.8, freshness: 1, safetyPassed: false },
      { creatorId: "d", emotionalSimilarity: 0.75, freshness: 0.8, safetyPassed: true }
    ]);

    expect(selected).toHaveLength(2);
    expect(selected[0]?.creatorId).toBe("a");
    expect(selected[1]?.creatorId).toBe("d");
  });
});
