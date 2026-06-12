import { describe, expect, it } from "vitest";

import {
  applyFypLearningFeedback,
  buildFypPersonalizationMemory,
  validateFypPersonalizationLearningRuntime
} from "@/src/core/fyp/runtime-learning/personalizationLearning";

describe("FYP Mega Pack 06 — Personalization Memory + Learning Feedback", () => {
  it("builds personalization memory from tracking signals", () => {
    const memory = buildFypPersonalizationMemory();

    expect(memory.userId).toBe("local-user");
    expect(memory.confidence).toBeGreaterThan(0);
    expect(Object.keys(memory.preferredTraceLanes).length).toBeGreaterThan(0);
    expect(Object.keys(memory.preferredSources).length).toBeGreaterThan(0);
  });

  it("applies learning feedback to ranked cards", () => {
    const feedback = applyFypLearningFeedback();

    expect(feedback.appliedSignals).toBeGreaterThan(0);
    expect(feedback.ranked.length).toBeGreaterThan(0);
    expect(feedback.ranked[0]?.rankReasons).toContain("learning_feedback");
  });

  it("keeps learned ranking sorted and bounded", () => {
    const feedback = applyFypLearningFeedback();

    expect(
      feedback.ranked.every((card, index, list) =>
        card.rankScore >= 0 &&
        card.rankScore <= 1 &&
        (index === 0 || list[index - 1].rankScore >= card.rankScore)
      )
    ).toBe(true);
  });

  it("validates complete personalization learning runtime", () => {
    expect(validateFypPersonalizationLearningRuntime()).toBe(true);
  });
});
