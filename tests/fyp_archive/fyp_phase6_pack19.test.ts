import { describe, expect, it } from "vitest";
import {
  buildCuriosityFeed,
  computeCuriosityScore,
  injectCuriosityGap,
  markCuriosityItems,
  preventCuriositySpam,
} from "../../src/lib/fyp_archive/curiosity_gap";

describe("Phase 6 Pack 19 — Curiosity Gap", () => {
  const items = [
    { id: "1", title: "normal clip" },
    { id: "2", title: "unexpected reaction moment" },
    { id: "3", title: "what happens next" },
  ];

  it("computes curiosity score", () => {
    expect(computeCuriosityScore(items[1])).toBeGreaterThan(0);
  });

  it("marks curiosity items", () => {
    const out = markCuriosityItems(items);
    expect(out.some((x: any) => x.hasCuriosity)).toBe(true);
  });

  it("injects curiosity gap", () => {
    const out = injectCuriosityGap(markCuriosityItems(items));
    expect(out[1].curiositySlot).toBe(true);
  });

  it("prevents curiosity spam", () => {
    const feed = [
      { hasCuriosity: true },
      { hasCuriosity: true },
      { hasCuriosity: true },
      { hasCuriosity: false },
    ];
    const out = preventCuriositySpam(feed, 2);
    expect(out.length).toBe(3);
  });

  it("builds curiosity feed", () => {
    const out = buildCuriosityFeed(items);
    expect(out.length).toBeGreaterThan(0);
  });
});
