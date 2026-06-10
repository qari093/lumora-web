import { describe, expect, it } from "vitest";
import {
  fypYoutubeVideos,
  getFypYoutubeFeedSummary,
  youtubeWatchUrl
} from "../../src/core/fyp/youtubeFeed";

describe("FYP YouTube-style feed", () => {
  it("generates YouTube watch URLs", () => {
    expect(youtubeWatchUrl("abc123")).toBe("https://www.youtube.com/watch?v=abc123");
  });

  it("contains safe embedded-only feed cards", () => {
    expect(fypYoutubeVideos.length).toBeGreaterThanOrEqual(3);
    expect(fypYoutubeVideos.every((video) => video.sourceLabel === "YouTube")).toBe(true);
    expect(fypYoutubeVideos.every((video) => video.safetyLabel === "embedded_only")).toBe(true);
    expect(fypYoutubeVideos.every((video) => video.youtubeWatchUrl.includes("youtube.com/watch"))).toBe(true);
    expect(fypYoutubeVideos.every((video) => video.thumbnailUrl.includes("i.ytimg.com"))).toBe(true);
  });

  it("keeps rehosting disabled", () => {
    const summary = getFypYoutubeFeedSummary();

    expect(summary.status).toBe("FYP_YOUTUBE_STYLE_FEED_READY");
    expect(summary.rehosting).toBe(false);
    expect(summary.embeddedOnly).toBe(true);
    expect(summary.safeMode).toBe(true);
  });
});
