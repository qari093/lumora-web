import { describe, expect, it } from "vitest";

import {
  buildRealFeedCards,
  validateRealFeedAdapter
} from "@/src/core/fyp/runtime-adapter/realFeedAdapter";

describe("FYP Mega Pack 05 — Real Feed Adapter", () => {
  it("builds real feed cards", () => {
    const cards = buildRealFeedCards();

    expect(cards.length).toBeGreaterThan(0);
  });

  it("creates autoplay eligible cards", () => {
    const cards = buildRealFeedCards();

    expect(cards.every(card => card.autoplayEligible)).toBe(true);
  });

  it("validates complete adapter runtime", () => {
    expect(validateRealFeedAdapter()).toBe(true);
  });
});
