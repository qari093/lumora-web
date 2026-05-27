import { describe, expect, it } from "vitest";

import { validateRecommendationCandidate } from "@/src/core/fyp/recommendation/contracts/recommendationContract";
import { rankRecommendationCandidate } from "@/src/core/fyp/recommendation/runtime/recommendationRanker";
import { runRecommendationRuntime } from "@/src/core/fyp/recommendation/runtime/recommendationRuntime";

const candidates = [
  {
    id: "item_1",
    qualityScore: 95,
    trendScore: 90,
    socialScore: 80,
    emotionScore: 85
  },
  {
    id: "item_2",
    qualityScore: 50,
    trendScore: 40,
    socialScore: 30,
    emotionScore: 20
  }
];

describe("Lumora FYP Recommendation Runtime Activation", () => {
  it("validates recommendation candidate", () => {
    expect(validateRecommendationCandidate(candidates[0])).toBe(true);
  });

  it("ranks recommendation candidate", () => {
    const result = rankRecommendationCandidate(candidates[0]);

    expect(result.rankScore).toBeGreaterThan(75);
    expect(result.reason).toBe("high_relevance");
  });

  it("supports standard relevance", () => {
    const result = rankRecommendationCandidate(candidates[1]);

    expect(result.reason).toBe("standard_relevance");
  });

  it("sorts recommendations", () => {
    const results = runRecommendationRuntime(candidates);

    expect(results[0].id).toBe("item_1");
  });

  it("runs recommendation runtime", () => {
    const results = runRecommendationRuntime([candidates[0]]);

    expect(results).toHaveLength(1);
    expect(results[0].rankScore).toBeGreaterThan(0);
  });
});
