import { describe, expect, it } from "vitest";
import {
  buildRewatchLoopFeed,
  computeRewatchScore,
  injectRewatchLoop,
  markRewatchCandidates,
  preventLoopSpam,
} from "../../src/lib/fyp_archive/rewatch_loop";

describe("Phase 7 Pack 21 — Rewatch Loop", () => {
  const items = [
    { id: "1", viralScore: 0.8 },
    { id: "2", curiosityScore: 0.6 },
    { id: "3", humanScore: 0.2 },
  ];

  it("computes rewatch score", () => {
    expect(computeRewatchScore(items[0])).toBeGreaterThan(0);
  });

  it("marks rewatch candidates", () => {
    const out = markRewatchCandidates(items);
    expect(out.some((x: any) => x.rewatchCandidate)).toBe(true);
  });

  it("injects rewatch loop", () => {
    const out = injectRewatchLoop(markRewatchCandidates(items));
    expect(out.some((x: any) => x.rewatchLoop)).toBe(true);
  });

  it("prevents loop spam", () => {
    const feed = [
      { rewatchLoop: true },
      { rewatchLoop: true },
    ];
    const out = preventLoopSpam(feed, 1);
    expect(out.length).toBe(1);
  });

  it("builds rewatch loop feed", () => {
    const out = buildRewatchLoopFeed(items);
    expect(out.length).toBeGreaterThan(0);
  });
});
