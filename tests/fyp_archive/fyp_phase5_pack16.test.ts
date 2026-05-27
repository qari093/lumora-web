import { describe, expect, it } from "vitest";
import {
  buildViralFeed,
  computeViralScore,
  injectViralBoost,
  limitViralStreak,
  markViralCandidates,
} from "../../src/lib/fyp_archive/viral_engine";

describe("Phase 5 Pack 16 — Viral Engine", () => {
  const items = [
    { id: "1", title: "calm scene", humanScore: 0 },
    { id: "2", title: "funny unexpected fail reaction", humanScore: 0.5 },
    { id: "3", title: "crowd cheering", humanScore: 0.3 },
  ];

  it("computes viral score", () => {
    expect(computeViralScore(items[1])).toBeGreaterThan(computeViralScore(items[0]));
  });

  it("marks viral candidates", () => {
    const out = markViralCandidates(items);
    expect(out.some((x: any) => x.isViral)).toBe(true);
  });

  it("injects viral boost", () => {
    const out = injectViralBoost(markViralCandidates(items));
    expect(out[0].viralBoost).toBe(true);
  });

  it("limits viral streak", () => {
    const feed = [
      { isViral: true },
      { isViral: true },
      { isViral: true },
      { isViral: false },
    ];
    const out = limitViralStreak(feed, 2);
    expect(out.length).toBe(3);
  });

  it("builds viral feed", () => {
    const out = buildViralFeed(items);
    expect(out.length).toBeGreaterThan(0);
  });
});
