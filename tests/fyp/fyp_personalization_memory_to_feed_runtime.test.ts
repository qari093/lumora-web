import { describe, expect, it, beforeEach } from "vitest";

import {
  appendFypEvent,
  clearFypEventsForTest
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

import { applyFypLearningFeedback } from "@/src/core/fyp/runtime-learning/personalizationLearning";
import { applyTraceAwareFeedRerank } from "@/src/core/fyp/runtime-learning/traceAwareRerank";

describe("FYP personalization memory → feed runtime", () => {
  beforeEach(() => {
    clearFypEventsForTest();
  });

  it("builds personalization memory from stored events", () => {
    appendFypEvent({
      cardId: "seed-1",
      event: "watch_progress",
      value: 1,
      lane: "wonder",
      sessionId: "session-1"
    });

    const feedback = applyFypLearningFeedback();

    expect(feedback.appliedSignals).toBeGreaterThan(0);
    expect(feedback.memory.confidence).toBeGreaterThan(0);
  });

  it("feeds personalization memory into ranking runtime", () => {
    appendFypEvent({
      cardId: "seed-1",
      event: "save",
      value: 1,
      lane: "wonder",
      sessionId: "session-1"
    });

    const feedback = applyFypLearningFeedback();

    expect(
      feedback.ranked.every(card =>
        card.rankReasons.includes("personalization_memory")
      )
    ).toBe(true);
  });

  it("feeds personalization output into trace aware rerank", () => {
    appendFypEvent({
      cardId: "seed-1",
      event: "watch_progress",
      value: 1,
      lane: "wonder",
      sessionId: "session-1"
    });

    const runtime = applyTraceAwareFeedRerank();

    expect(runtime.cards.length).toBeGreaterThan(0);

    expect(
      runtime.cards.every(card =>
        card.rankReasons.includes("trace_aware_rerank")
      )
    ).toBe(true);
  });

  it("produces final feed cards from real learning data", () => {
    appendFypEvent({
      cardId: "seed-1",
      event: "save",
      value: 1,
      lane: "wonder",
      sessionId: "session-1"
    });

    appendFypEvent({
      cardId: "seed-2",
      event: "watch_progress",
      value: 1,
      lane: "learn",
      sessionId: "session-1"
    });

    const runtime = applyTraceAwareFeedRerank();

    expect(runtime.cards[0]).toBeDefined();
    expect(runtime.traceCoverage.length).toBeGreaterThan(0);
  });
});
