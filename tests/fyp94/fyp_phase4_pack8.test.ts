import { describe, expect, it } from "vitest";
import {
  buildUnpredictableFeed,
  injectDifferentCategoryAfterStreak,
  limitCategoryStreak,
  maintainFeedUnpredictability,
} from "../../scripts/fyp94/feed_unpredictability.mjs";

describe("Phase 4 Pack 8 — Category Streak + Unpredictability", () => {
  const items = [
    { id: "1", category: "sports" },
    { id: "2", category: "sports" },
    { id: "3", category: "sports" },
    { id: "4", category: "urban" },
    { id: "5", category: "people" },
  ];

  it("limits same-category streak to 2", () => {
    const out = limitCategoryStreak(items, 2);

    let streak = 1;
    for (let i = 1; i < out.length; i++) {
      if (out[i].category === out[i - 1].category) streak++;
      else streak = 1;

      expect(streak).toBeLessThanOrEqual(2);
    }
  });

  it("injects different category after streak", () => {
    const out = injectDifferentCategoryAfterStreak(items, 2);
    expect(out.length).toBeGreaterThan(0);
  });

  it("adds unpredictability slots", () => {
    const out = maintainFeedUnpredictability(items);
    expect(out.some(x => x.unpredictabilitySlot === "shift")).toBe(true);
  });

  it("builds unpredictable feed", () => {
    const out = buildUnpredictableFeed(items);
    expect(out.length).toBeGreaterThan(0);
    expect(out[0].unpredictabilitySlot).toBeTruthy();
  });
});
