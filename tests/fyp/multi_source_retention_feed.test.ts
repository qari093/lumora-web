import { describe, expect, it } from "vitest";
import { fypYoutubeVideos, getFypYoutubeFeedSummary } from "../../src/core/fyp/youtubeFeed";

describe("FYP 48-source retention feed", () => {
  it("contains all 48 approved source lanes", () => {
    const summary = getFypYoutubeFeedSummary();

    expect(summary.status).toBe("FYP_DISTINCT_SOURCE_FEED_READY");
    expect(summary.sourceCount).toBe(48);
    expect(summary.itemCount).toBe(48);
  });

  it("keeps every source inside safe policy", () => {
    const allowed = new Set(["public_domain", "cc_filtered", "owned_or_licensed", "authorized_only", "embedded_only"]);

    expect(fypYoutubeVideos.every((item) => allowed.has(item.safetyLabel))).toBe(true);
    expect(fypYoutubeVideos.every((item) => item.youtubeWatchUrl.includes("youtube.com/watch"))).toBe(true);
  });

  it("creates retention variety across lanes", () => {
    const lanes = new Set(fypYoutubeVideos.map((item) => item.retentionLane));

    expect(lanes.size).toBeGreaterThanOrEqual(8);
  });
});
