import { describe, expect, it } from "vitest";

import {
  buildFypRuntimeTrackingBatch,
  createFypRuntimeTrackingEvent,
  validateFypRuntimeTrackingIntegration
} from "@/src/core/fyp/runtime-tracking/fypRuntimeTracking";

import { buildFypRuntimeUiState } from "@/src/core/fyp/runtime-ui/fypRuntimeUi";

describe("FYP Mega Pack 05 — Tracking API Integration", () => {
  it("creates impression tracking event for active card", () => {
    const state = buildFypRuntimeUiState();
    const event = createFypRuntimeTrackingEvent("impression", state.activeCard?.id ?? "");

    expect(event.type).toBe("impression");
    expect(event.cardId).toBe(state.activeCard?.id);
    expect(event.sourceId).toBeTruthy();
  });

  it("creates runtime tracking batch", () => {
    const batch = buildFypRuntimeTrackingBatch();

    expect(batch).toHaveLength(3);
    expect(batch.map((event) => event.type)).toContain("impression");
    expect(batch.map((event) => event.type)).toContain("view");
    expect(batch.map((event) => event.type)).toContain("watch_progress");
  });

  it("clamps tracking values safely", () => {
    const state = buildFypRuntimeUiState();
    const event = createFypRuntimeTrackingEvent("watch_progress", state.activeCard?.id ?? "", 99);

    expect(event.value).toBe(1);
  });

  it("validates tracking integration", () => {
    expect(validateFypRuntimeTrackingIntegration()).toBe(true);
  });
});
