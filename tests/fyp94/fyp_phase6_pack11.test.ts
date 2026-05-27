import { describe, expect, it } from "vitest";
import {
  buildRealismDiversityFeed,
  enforceMultiQueryDistribution,
  injectRandomCategoryClip,
  reduceAestheticOnlyWeight,
  scoreHumanActivity,
} from "../../scripts/fyp94/realism_diversity.mjs";

describe("Phase 6 Pack 11 — Diversity & Realism Enforcement", () => {
  it("scores human activity clips higher", () => {
    expect(scoreHumanActivity({ query: "kids laughing" })).toBe(1);
    expect(scoreHumanActivity({ query: "mountain sunset", humanScore: 0.2 })).toBe(0.2);
  });

  it("reduces aesthetic-only content weight", () => {
    const out = reduceAestheticOnlyWeight([
      { id: "aesthetic", query: "sunset beach", humanScore: 0.1 },
      { id: "human", query: "crowd cheering" },
    ]);

    expect(out[0].id).toBe("human");
  });

  it("injects random category clips", () => {
    const out = injectRandomCategoryClip(
      [{ id: "1", category: "sports" }],
      [{ id: "2", category: "urban" }]
    );

    expect(out.some(x => x.id === "2")).toBe(true);
  });

  it("enforces multi-query distribution", () => {
    const clips = Array.from({ length: 10 }).map((_, i) => ({
      id: String(i),
      query: "same-query",
    }));

    expect(enforceMultiQueryDistribution(clips, 5)).toHaveLength(5);
  });

  it("builds realism diversity feed", () => {
    const out = buildRealismDiversityFeed([
      { id: "1", query: "sunset", category: "nature", humanScore: 0.1 },
      { id: "2", query: "crowd cheering", category: "people" },
    ]);

    expect(out.length).toBeGreaterThan(0);
    expect(out[0].query).toContain("crowd");
  });
});
