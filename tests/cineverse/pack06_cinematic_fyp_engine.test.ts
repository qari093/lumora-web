import { describe, expect, it } from "vitest";
import { cineverseFypSeedCards } from "../../src/cineverse/fyp/feed";
import {
  rankCineVerseFypCards,
  shouldInjectEmotionalDiversity,
} from "../../src/cineverse/fyp/runtime";

describe("CineVerse Pack 06 — Cinematic FYP Engine", () => {
  it("ranks FYP cards by priority", () => {
    const ranked = rankCineVerseFypCards(cineverseFypSeedCards);
    expect(ranked[0]?.priority).toBeGreaterThanOrEqual(ranked[1]?.priority ?? 0);
  });

  it("injects emotional diversity after repetitive dominance", () => {
    expect(shouldInjectEmotionalDiversity({
      dominantEmotionPercent: 82,
      consecutiveDays: 3,
    })).toBe(true);
  });
});
