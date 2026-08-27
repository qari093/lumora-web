import { describe, it, expect } from "vitest";
import { applyEngagementBoost } from "@/lib/ranking/score";

describe("ranking engagement boost caps", () => {
  it("never exceeds +8% of base score", () => {
    const base = 1000;
    const r = applyEngagementBoost({
      baseScore: base,
      isMissionLane: true,
      engagement: { xpBalance: 1_000_000, harmonyLevel: 10_000, squadScore: 1_000_000 },
    });
    expect(r.score).toBeGreaterThanOrEqual(base);
    expect(r.boostApplied).toBeLessThanOrEqual(base * 0.08 + 1e-9);
  });

  it("handles non-finite base score safely", () => {
    const r = applyEngagementBoost({
      baseScore: NaN,
      engagement: { xpBalance: 100, harmonyLevel: 10, squadScore: 5 },
    });
    expect(Number.isFinite(r.score)).toBe(true);
  });
});
