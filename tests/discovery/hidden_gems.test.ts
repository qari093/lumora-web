import { describe, expect, it } from "vitest";
import { computeEngagementRatio, isHiddenGem, missionDiscoveryHook } from "@/lib/discovery/hiddenGems";

describe("hidden gems", () => {
  it("computes conservative engagement ratio and clamps", () => {
    const r = computeEngagementRatio({ views: 10, likes: 10, shares: 10, comments: 10, reactions: 10 });
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThanOrEqual(0.5);
  });

  it("flags high ratio with low views as hidden gem", () => {
    const d = isHiddenGem({ views: 120, likes: 12, reactions: 8, shares: 2, comments: 3, ageHours: 12 });
    expect(d.isHiddenGem).toBe(true);
    expect(d.reason).toBe("high_ratio_low_views");
  });

  it("does not flag old content aggressively", () => {
    const d = isHiddenGem({ views: 120, likes: 20, shares: 4, comments: 3, ageHours: 240 });
    expect(d.isHiddenGem).toBe(false);
    expect(d.reason).toBe("too_old");
  });

  it("missionDiscoveryHook returns hint only when hidden gem", () => {
    const h1 = missionDiscoveryHook({ views: 50, likes: 8, reactions: 5, shares: 1, comments: 2, ageHours: 6 });
    expect(h1.hint).toBe("DISCOVER_HIDDEN_GEM");

    const h2 = missionDiscoveryHook({ views: 2000, likes: 50, reactions: 20, shares: 1, comments: 2, ageHours: 6 });
    expect(h2.hint).toBeNull();
  });
});
