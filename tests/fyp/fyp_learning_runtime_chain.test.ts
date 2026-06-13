import { describe, expect, it, beforeEach } from "vitest";

import {
  appendFypEvent,
  clearFypEventsForTest,
  readRecentFypEvents
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

describe("FYP learning runtime chain", () => {
  beforeEach(() => {
    clearFypEventsForTest();
  });

  it("captures behavioral events for future learning", () => {
    appendFypEvent({
      cardId: "wonder-1",
      event: "impression",
      sessionId: "test-session"
    });

    appendFypEvent({
      cardId: "wonder-1",
      event: "view",
      sessionId: "test-session"
    });

    appendFypEvent({
      cardId: "wonder-1",
      event: "watch_progress",
      watchedMs: 12000,
      sessionId: "test-session"
    });

    appendFypEvent({
      cardId: "wonder-1",
      event: "save",
      sessionId: "test-session"
    });

    const events = readRecentFypEvents();

    expect(events.length).toBe(4);
    expect(events.some((e) => e.event === "impression")).toBe(true);
    expect(events.some((e) => e.event === "view")).toBe(true);
    expect(events.some((e) => e.event === "watch_progress")).toBe(true);
    expect(events.some((e) => e.event === "save")).toBe(true);
  });

  it("contains positive learning signals", () => {
    appendFypEvent({
      cardId: "learn-1",
      event: "watch_progress",
      watchedMs: 18000,
      sessionId: "test-session"
    });

    appendFypEvent({
      cardId: "learn-1",
      event: "complete",
      sessionId: "test-session"
    });

    const events = readRecentFypEvents();

    const score = events.reduce((sum, e) => sum + e.value, 0);

    expect(score).toBeGreaterThan(0);
  });
});
