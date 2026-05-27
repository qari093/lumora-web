import { describe, expect, it } from "vitest";

import {
  isAnalyticsEventName,
  validateAnalyticsEvent
} from "@/src/core/fyp/analytics/contracts/analyticsContract";

import { AnalyticsStore } from "@/src/core/fyp/analytics/runtime/analyticsStore";

import {
  createFypAnalyticsRuntime
} from "@/src/core/fyp/analytics/runtime/analyticsRuntime";

import {
  createSessionAnalyticsEvent
} from "@/src/core/fyp/analytics/runtime/sessionAnalytics";

const event = createSessionAnalyticsEvent(
  "user_1",
  "session_1"
);

describe("Lumora FYP Analytics Runtime Activation", () => {
  it("validates analytics event names", () => {
    expect(isAnalyticsEventName("video_view")).toBe(true);
    expect(isAnalyticsEventName("bad_event")).toBe(false);
  });

  it("validates analytics event contract", () => {
    expect(validateAnalyticsEvent(event)).toBe(true);
  });

  it("stores analytics events", () => {
    const store = new AnalyticsStore();

    store.push(event);

    expect(store.all()).toHaveLength(1);
    expect(store.snapshot().totalEvents).toBe(1);
  });

  it("tracks analytics runtime events", () => {
    const runtime = createFypAnalyticsRuntime();

    const result = runtime.track(event);

    expect(result.ok).toBe(true);
    expect(result.snapshot.totalEvents).toBe(1);
  });

  it("creates session analytics events", () => {
    expect(event.name).toBe("session_start");
    expect(event.userId).toBe("user_1");
  });
});
