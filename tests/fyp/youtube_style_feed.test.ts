import { describe, expect, it } from "vitest";
import {
  fypYoutubeVideos,
  getFypYoutubeFeedSummary,
  youtubeWatchUrl
} from "../../src/core/fyp/youtubeFeed";

describe("FYP multi-source video feed", () => {
  it("generates YouTube watch URLs for embed/link cards", () => {
    expect(youtubeWatchUrl("abc123")).toBe("https://www.youtube.com/watch?v=abc123");
  });

  it("contains safe multi-source feed cards", () => {
    const allowed = new Set([
      "public_domain",
      "cc_filtered",
      "owned_or_licensed",
      "authorized_only",
      "embedded_only"
    ]);

    expect(fypYoutubeVideos.length).toBe(48);
    expect(fypYoutubeVideos.every((video) => allowed.has(video.safetyLabel))).toBe(true);
    expect(fypYoutubeVideos.every((video) => video.youtubeWatchUrl.includes("youtube.com/watch"))).toBe(true);
    expect(fypYoutubeVideos.every((video) => video.thumbnailUrl.includes("i.ytimg.com"))).toBe(true);
  });

  it("keeps rehosting disabled", () => {
    const summary = getFypYoutubeFeedSummary();

    expect(summary.status).toBe("FYP_DISTINCT_SOURCE_FEED_READY");
    expect(summary.rehosting).toBe(false);
    expect(summary.embeddedOnly).toBe(true);
    expect(summary.safeMode).toBe(true);
    expect(summary.sourceCount).toBe(48);
  });
});
