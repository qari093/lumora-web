import { describe, expect, it } from "vitest";
import { offlinePlayback } from "../../src/echo/offline/offlinePlayback";
import { smartCacheRuntime } from "../../src/echo/offline/cacheRuntime";
import { downloadManager } from "../../src/echo/offline/downloads";
import { lowBandwidthMode } from "../../src/echo/offline/lowBandwidth";

describe("Echo Pack 14 — Offline Runtime", () => {
  it("supports offline playback", () => {
    expect(offlinePlayback().supported).toBe(true);
  });

  it("supports resilient cache", () => {
    expect(smartCacheRuntime().resilient).toBe(true);
  });

  it("supports downloads and bandwidth mode", () => {
    expect(downloadManager().managed).toBe(true);
    expect(lowBandwidthMode().enabled).toBe(true);
  });
});
