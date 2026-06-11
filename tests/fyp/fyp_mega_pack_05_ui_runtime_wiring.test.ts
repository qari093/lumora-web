import { describe, expect, it } from "vitest";

import {
  buildFypRuntimeUiState,
  validateFypRuntimeUiWiring
} from "@/src/core/fyp/runtime-ui/fypRuntimeUi";

describe("FYP Mega Pack 05 — UI Runtime Wiring", () => {
  it("builds UI state from real feed adapter", () => {
    const state = buildFypRuntimeUiState();

    expect(state.source).toBe("real_feed_adapter");
    expect(state.ready).toBe(true);
    expect(state.empty).toBe(false);
    expect(state.cards.length).toBeGreaterThan(0);
  });

  it("sets active card from real feed", () => {
    const state = buildFypRuntimeUiState();

    expect(state.activeCard).not.toBeNull();
    expect(state.activeCard?.playbackUrl).toBeTruthy();
  });

  it("validates complete UI runtime wiring", () => {
    expect(validateFypRuntimeUiWiring()).toBe(true);
  });
});
