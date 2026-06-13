import { describe, expect, it, beforeEach } from "vitest";

import {
  appendFypEvent,
  clearFypEventsForTest,
  normalizeFypEvent,
  readRecentFypEvents
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

describe("FYP event store + track route foundation", () => {
  beforeEach(() => {
    clearFypEventsForTest();
  });

  it("normalizes valid watch progress events", () => {
    const event = normalizeFypEvent({
      cardId: "card-1",
      event: "watch_progress",
      watchedMs: 15000,
      lane: "wonder",
      sessionId: "s1"
    });

    expect(event?.cardId).toBe("card-1");
    expect(event?.event).toBe("watch_progress");
    expect(event?.value).toBeGreaterThan(0);
    expect(event?.source).toBe("fyp_tracking_v1");
  });

  it("persists recent events safely", () => {
    appendFypEvent({ cardId: "card-1", event: "impression", sessionId: "s1" });
    appendFypEvent({ cardId: "card-1", event: "spark", sessionId: "s1" });

    const events = readRecentFypEvents();

    expect(events).toHaveLength(2);
    expect(events[0].event).toBe("impression");
    expect(events[1].event).toBe("spark");
  });

  it("rejects invalid events", () => {
    expect(normalizeFypEvent({ event: "view" })).toBeNull();
    expect(normalizeFypEvent({ cardId: "x", event: "invalid" })).toBeNull();
  });
});
