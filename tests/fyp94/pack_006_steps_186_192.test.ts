import { describe, expect, it } from "vitest";
import { createYouTubeMetadataTrend } from "../../src/lib/fyp94/trend/youtubeMetadata";
import { mapFyp94TrendToLegalQuery } from "../../src/lib/fyp94/trend/map";
import { buildFyp94TrendCaption, buildFyp94TrendStyleOverlay } from "../../src/lib/fyp94/trend/captions";
import { injectFyp94TrendMetadata } from "../../src/lib/fyp94/trend/inject";

describe("FYP 9.4 Pack 006 — Trend Mirror Engine", () => {
  it("creates YouTube metadata-only trend input", () => {
    const trend = createYouTubeMetadataTrend({
      id: "yt_1",
      title: "Extreme parkour POV goes viral",
      keywords: ["parkour", "pov", "jump"],
      category: "sports",
    });

    expect(trend.source).toBe("youtube_metadata");
    expect(trend.keywords).toContain("parkour");
  });

  it("maps trend to legal source query", () => {
    const trend = createYouTubeMetadataTrend({
      id: "yt_2",
      title: "Bike stunt fail",
      keywords: ["bike", "stunt", "fail"],
      category: "sports",
    });

    const mapped = mapFyp94TrendToLegalQuery(trend);

    expect(mapped.query).toContain("bike");
    expect(mapped.styleLabel).toBe("adrenaline");
  });

  it("builds captions and style overlays", () => {
    const mapped = mapFyp94TrendToLegalQuery(
      createYouTubeMetadataTrend({
        id: "yt_3",
        title: "Funny dog jump",
        keywords: ["dog", "funny"],
        category: "pets",
      }),
    );

    expect(buildFyp94TrendCaption(mapped)).toContain("Trending now");
    expect(buildFyp94TrendStyleOverlay(mapped).intensity).toBe("medium");
  });

  it("injects trend metadata into legal clips", () => {
    const mapped = mapFyp94TrendToLegalQuery(
      createYouTubeMetadataTrend({
        id: "yt_4",
        title: "Surf wipeout",
        keywords: ["surf", "fail"],
        category: "sports",
      }),
    );

    const injected = injectFyp94TrendMetadata([{ id: "clip_1" }], mapped);

    expect(injected[0].trend.trendId).toBe("yt_4");
    expect(injected[0].trend.caption).toContain("Surf wipeout");
  });
});
