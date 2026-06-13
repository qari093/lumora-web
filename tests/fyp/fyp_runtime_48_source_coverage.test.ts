import { describe, expect, it } from "vitest";

import {
  DEFAULT_RUNTIME_FEED_INPUTS,
  buildFypRuntimeApiFeed
} from "@/src/core/fyp/runtime-api/feedApiBridge";

describe("FYP runtime 48 source coverage", () => {
  it("keeps 48 configured runtime source inputs", () => {
    expect(DEFAULT_RUNTIME_FEED_INPUTS.length).toBe(48);
  });

  it("returns 48 playable runtime feed items after safe source aliasing", () => {
    const feed = buildFypRuntimeApiFeed();

    expect(feed.ok).toBe(true);
    expect(feed.items.length).toBe(48);
    expect(feed.blocked).toBe(0);
    expect(feed.items.every((item) => item.playbackUrl.startsWith("https://"))).toBe(true);
    expect(feed.items.every((item) => item.playbackUrl.endsWith(".mp4"))).toBe(true);
    expect(feed.items.every((item) => item.deliveryLane === "native_video")).toBe(true);
  });
});
