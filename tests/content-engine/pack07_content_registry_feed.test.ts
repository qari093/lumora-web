import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createContentRegistryItem,
  createFeedResponse,
  filterFeedEligibleContent,
  getSeedContentRegistry,
  sortContentForFeed,
  validateFeedResponse,
} from "@/src/content-engine/registry";

describe("Content Engine Pack07 — Content Registry Feed API", () => {
  it("creates registry item", () => {
    const item = createContentRegistryItem({
      contentId: "c1",
      hlsPlaylistUrl: "/hls/c1/master.m3u8",
      thumbnailUrl: "/thumb/c1.jpg",
    });

    expect(item.status).toBe("safe");
    expect(item.contentId).toBe("c1");
  });

  it("filters only feed eligible safe content", () => {
    const safe = createContentRegistryItem({
      contentId: "safe",
      hlsPlaylistUrl: "/hls/safe/master.m3u8",
      thumbnailUrl: "/thumb/safe.jpg",
      status: "safe",
    });

    const blocked = createContentRegistryItem({
      contentId: "blocked",
      hlsPlaylistUrl: "/hls/blocked/master.m3u8",
      thumbnailUrl: "/thumb/blocked.jpg",
      status: "blocked",
    });

    expect(filterFeedEligibleContent([safe, blocked])).toHaveLength(1);
  });

  it("sorts feed by resonance and presence", () => {
    const low = createContentRegistryItem({
      contentId: "low",
      hlsPlaylistUrl: "/hls/low/master.m3u8",
      thumbnailUrl: "/thumb/low.jpg",
      resonanceIndex: 0.1,
    });

    const high = createContentRegistryItem({
      contentId: "high",
      hlsPlaylistUrl: "/hls/high/master.m3u8",
      thumbnailUrl: "/thumb/high.jpg",
      resonanceIndex: 0.9,
    });

    expect(sortContentForFeed([low, high])[0].contentId).toBe("high");
  });

  it("creates valid feed response", () => {
    const response = createFeedResponse({
      items: getSeedContentRegistry(),
      limit: 2,
    });

    expect(response.ok).toBe(true);
    expect(response.count).toBe(2);
    expect(validateFeedResponse(response).ok).toBe(true);
  });

  it("adds feed API route", () => {
    expect(fs.existsSync("app/api/content-engine/feed/route.ts")).toBe(true);
  });
});
