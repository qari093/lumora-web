import { describe, expect, it } from "vitest";
import { fypYoutubeVideos, getFypYoutubeFeedSummary } from "../../src/core/fyp/youtubeFeed";

describe("FYP distinct source feed", () => {
  it("does not fake 48 sources from only 3 video assets", () => {
    const uniqueAssets = new Set(fypYoutubeVideos.map((item) => item.youtubeWatchUrl));

    expect(fypYoutubeVideos.length).toBe(48);
    expect(uniqueAssets.size).toBeGreaterThan(20);
  });

  it("keeps all 48 sources present", () => {
    const uniqueSources = new Set(fypYoutubeVideos.map((item) => item.sourceLabel));

    expect(uniqueSources.size).toBe(48);
  });

  it("reports distinct source readiness", () => {
    const summary = getFypYoutubeFeedSummary();

    expect(summary.status).toBe("FYP_DISTINCT_SOURCE_FEED_READY");
    expect(summary.uniqueVideoAssets).toBeGreaterThan(20);
    expect(summary.rehosting).toBe(false);
    expect(summary.safeMode).toBe(true);
  });
});
