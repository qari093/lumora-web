import { describe, expect, it, beforeEach } from "vitest";

import {
  appendFypEvent,
  clearFypEventsForTest,
  readRecentFypEvents
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

describe("FYP real event → ranking bridge readiness", () => {
  beforeEach(() => {
    clearFypEventsForTest();
  });

  it("stores ranking-relevant signals", () => {
    appendFypEvent({
      cardId: "wonder-video",
      event: "impression",
      lane: "wonder",
      sessionId: "bridge-test"
    });

    appendFypEvent({
      cardId: "wonder-video",
      event: "view",
      lane: "wonder",
      sessionId: "bridge-test"
    });

    appendFypEvent({
      cardId: "wonder-video",
      event: "watch_progress",
      watchedMs: 18000,
      lane: "wonder",
      sessionId: "bridge-test"
    });

    appendFypEvent({
      cardId: "wonder-video",
      event: "save",
      lane: "wonder",
      sessionId: "bridge-test"
    });

    const events = readRecentFypEvents();

    const score = events.reduce((sum, e) => sum + e.value, 0);

    expect(events.length).toBe(4);
    expect(score).toBeGreaterThan(1);
  });

  it("preserves lane information for future personalization", () => {
    appendFypEvent({
      cardId: "learn-video",
      event: "complete",
      lane: "learn",
      sessionId: "bridge-test"
    });

    const events = readRecentFypEvents();

    expect(events[0].lane).toBe("learn");
    expect(events[0].event).toBe("complete");
  });

  it("contains runtime fields required by ranking", () => {
    appendFypEvent({
      cardId: "build-video",
      event: "watch_progress",
      watchedMs: 9000,
      lane: "build",
      sessionId: "bridge-test"
    });

    const event = readRecentFypEvents()[0];

    expect(event.cardId).toBeTruthy();
    expect(event.sessionId).toBeTruthy();
    expect(event.value).toBeTypeOf("number");
    expect(event.ts).toBeTypeOf("number");
  });
});
