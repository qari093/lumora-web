import { describe, expect, it } from "vitest";
import {
  applyPreferenceWeighting,
  balanceAdaptiveFeed,
  rankBySessionSignals,
  tuneContrastingVideo,
  validatePersonalizationImpact,
} from "@/src/lib/integration/personalization";

describe("Pack19 Advanced Personalization", () => {
  it("passes personalization flow", () => {
    const videos = [
      { videoId: "v1", tone: "still" as const, baseScore: 1, source: "a" },
      { videoId: "v2", tone: "curious" as const, baseScore: 1, source: "b" },
      { videoId: "v3", tone: "still" as const, baseScore: 1, source: "a" },
    ];

    const weighted = videos.map((video) => applyPreferenceWeighting(video, { curious: 3 }));
    const ranked = rankBySessionSignals(weighted);
    const contrast = tuneContrastingVideo("still", videos);
    const balanced = balanceAdaptiveFeed(videos);
    const impact = validatePersonalizationImpact({ beforeRetention: 0.2, afterRetention: 0.25 });

    expect(ranked[0].videoId).toBe("v2");
    expect(contrast?.videoId).toBe("v2");
    expect(balanced).toHaveLength(2);
    expect(impact.ok).toBe(true);
    expect(impact.lift).toBeGreaterThan(0);
  });
});
