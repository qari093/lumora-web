import { describe, expect, it } from "vitest";
import { computeHeatScore, rankContent } from "@/src/content-engine/ranking";

describe("Content Engine Pack08 — Ranking + Tension Waves", () => {
  it("computes heat score correctly", () => {
    const score = computeHeatScore({
      impressions: 10,
      holds: 6,
      rewatches: 2,
      skips: 1,
      avgWatchMs: 20000,
      durationMs: 30000,
      uploadedAt: Date.now(),
    });

    expect(score).toBeGreaterThan(0);
  });

  it("ranks higher engagement content first", () => {
    const ranked = rankContent({
      lastTension: 0.2,
      stats: {
        a: {
          impressions: 10,
          holds: 2,
          rewatches: 0,
          skips: 5,
          avgWatchMs: 5000,
          durationMs: 30000,
          uploadedAt: Date.now(),
        },
        b: {
          impressions: 10,
          holds: 7,
          rewatches: 3,
          skips: 1,
          avgWatchMs: 25000,
          durationMs: 30000,
          uploadedAt: Date.now(),
        },
      },
    });

    expect(ranked[0].contentId).toBe("b");
  });
});
