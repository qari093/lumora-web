import { describe, it, expect } from "vitest";

import {
  evaluatePremiumFeelMetrics
} from "../../../src/core/fyp/analytics/premiumMetricsGate";

import {
  validateFypAnalyticsEvent
} from "../../../src/core/fyp/analytics/eventContract";

describe("FYP Omega Pack 17", () => {
  it("passes premium feel metrics when within budget", () => {
    const result = evaluatePremiumFeelMetrics({
      timeToFirstInteractionMs: 1200,
      accidentalSwipeBackRate: 0.03,
      curiosityRingCompletionRate: 0.48,
      shareToLumaSpaceRate: 0.12,
      highQualitySurveyAgreeRate: 0.86
    });

    expect(result.ok).toBe(true);
    expect(result.failures.length).toBe(0);
  });

  it("fails weak premium feel metrics", () => {
    const result = evaluatePremiumFeelMetrics({
      timeToFirstInteractionMs: 3500,
      accidentalSwipeBackRate: 0.11,
      curiosityRingCompletionRate: 0.2,
      shareToLumaSpaceRate: 0.02,
      highQualitySurveyAgreeRate: 0.5
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain("time_to_first_interaction_too_slow");
    expect(result.failures).toContain("curiosity_completion_too_low");
  });

  it("validates analytics event contract", () => {
    expect(
      validateFypAnalyticsEvent({
        name: "fyp_video_started",
        assetId: "asset_1",
        sessionId: "session_1",
        ts: Date.now()
      })
    ).toBe(true);
  });

  it("rejects malformed analytics events", () => {
    expect(
      validateFypAnalyticsEvent({
        name: "fyp_video_started",
        assetId: "",
        sessionId: "session_1",
        ts: Date.now()
      })
    ).toBe(false);
  });
});
