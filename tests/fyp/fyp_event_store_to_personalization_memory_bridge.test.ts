import { describe, expect, it, beforeEach } from "vitest";

import {
  appendFypEvent,
  clearFypEventsForTest
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

import {
  convertStoredFypEventToTrackingEvent,
  readRealFypTrackingEvents,
  validateRealEventLearningBridge
} from "@/src/core/fyp/runtime-learning/realEventLearningBridge";

import {
  applyFypLearningFeedback
} from "@/src/core/fyp/runtime-learning/personalizationLearning";

describe("FYP event store → personalization memory bridge", () => {
  beforeEach(() => {
    clearFypEventsForTest();
  });

  it("converts stored events into runtime tracking events", () => {
    const converted = convertStoredFypEventToTrackingEvent({
      id: "evt-1",
      cardId: "card-1",
      event: "spark",
      value: 0.75,
      watchedMs: 1000,
      lane: "wonder",
      sessionId: "s1",
      userId: "u1",
      ts: Date.now(),
      source: "fyp_tracking_v1"
    });

    expect(converted.cardId).toBe("card-1");
    expect(converted.type).toBe("like");
    expect(converted.value).toBe(0.75);
  });

  it("reads real stored events for learning", () => {
    appendFypEvent({ cardId: "card-1", event: "view", sessionId: "s1" });
    appendFypEvent({ cardId: "card-1", event: "save", sessionId: "s1" });

    const events = readRealFypTrackingEvents();

    expect(events.length).toBe(2);
    expect(events.some((event) => event.type === "save")).toBe(true);
  });

  it("keeps personalization learning runtime valid with real event bridge", () => {
    appendFypEvent({ cardId: "card-1", event: "watch_progress", watchedMs: 15000, sessionId: "s1" });

    const feedback = applyFypLearningFeedback();

    expect(feedback.appliedSignals).toBeGreaterThan(0);
    expect(feedback.ranked.length).toBeGreaterThan(0);
    expect(feedback.ranked.every((card) => card.rankReasons.includes("learning_feedback"))).toBe(true);
  });

  it("validates real event learning bridge", () => {
    expect(validateRealEventLearningBridge()).toBe(true);
  });
});
