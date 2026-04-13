import { describe, expect, it } from "vitest";
import { optimizeVideoPlayback } from "../../lib/video/videoPlaybackOptimization";

describe("video playback optimization", () => {
  it("uses conservative profile for data saver", () => {
    const result = optimizeVideoPlayback({
      networkMbps: 10,
      deviceMemoryGb: 8,
      prefersDataSaver: true,
      viewportHeight: 1080
    });

    expect(result.preferredResolution).toBe(360);
    expect(result.preload).toBe("none");
    expect(result.autoplay).toBe(false);
    expect(result.usePosterFirst).toBe(true);
  });

  it("selects high quality on fast devices", () => {
    const result = optimizeVideoPlayback({
      networkMbps: 20,
      deviceMemoryGb: 8,
      prefersDataSaver: false,
      viewportHeight: 1200
    });

    expect(result.preferredResolution).toBe(1080);
    expect(result.preload).toBe("auto");
  });

  it("limits preload on low memory devices", () => {
    const result = optimizeVideoPlayback({
      networkMbps: 20,
      deviceMemoryGb: 1,
      prefersDataSaver: false,
      viewportHeight: 1200
    });

    expect(result.preload).not.toBe("auto");
    expect(result.bufferAheadSec).toBeLessThanOrEqual(6);
  });

  it("uses medium profile on moderate connection", () => {
    const result = optimizeVideoPlayback({
      networkMbps: 4,
      deviceMemoryGb: 4,
      prefersDataSaver: false,
      viewportHeight: 800
    });

    expect([480, 720]).toContain(result.preferredResolution);
    expect(result.preload).toBe("metadata");
  });
});
