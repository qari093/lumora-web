import { describe, expect, it } from "vitest";

import {
  DEFAULT_RUNTIME_FEED_INPUTS,
  buildFypRuntimeApiFeed
} from "@/src/core/fyp/runtime-api/feedApiBridge";

describe("FYP runtime maximum video sources", () => {
  it("expands runtime feed inputs across the full registered source set", () => {
    expect(DEFAULT_RUNTIME_FEED_INPUTS.length).toBeGreaterThanOrEqual(48);
  });

  it("serves broad playable native mp4 runtime feed items", () => {
    const feed = buildFypRuntimeApiFeed();

    expect(feed.ok).toBe(true);
    expect(feed.source).toBe("lumora_fyp_ingestion_bridge");
    expect(feed.items.length).toBeGreaterThanOrEqual(48);
    expect(feed.items.every((item) => item.playbackUrl.startsWith("https://"))).toBe(true);
    expect(feed.items.every((item) => item.playbackUrl.endsWith(".mp4"))).toBe(true);
    expect(feed.items.every((item) => item.deliveryLane === "native_video")).toBe(true);
  });
});
