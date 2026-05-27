import { describe, expect, it } from "vitest";

import {
  validateWatchProgressEvent
} from "@/src/core/fyp/watch-progress/contracts/watchProgressContract";

import {
  trackWatchProgress
} from "@/src/core/fyp/watch-progress/runtime/watchProgressTracker";

import {
  runWatchProgressRuntime
} from "@/src/core/fyp/watch-progress/runtime/watchProgressRuntime";

const event = {
  itemId: "video_001",
  watchedMs: 5000,
  durationMs: 10000
};

describe("Lumora FYP Watch Progress Runtime Activation", () => {
  it("validates watch progress event", () => {
    expect(validateWatchProgressEvent(event)).toBe(true);
  });

  it("tracks engaged progress", () => {
    const result = trackWatchProgress(event);

    expect(result.percent).toBe(50);
    expect(result.milestone).toBe("engaged");
  });

  it("tracks completed progress", () => {
    const result = trackWatchProgress({
      ...event,
      watchedMs: 9800
    });

    expect(result.completed).toBe(true);
    expect(result.milestone).toBe("completed");
  });

  it("rejects invalid progress", () => {
    expect(() =>
      trackWatchProgress({
        ...event,
        watchedMs: 15000
      })
    ).toThrow("invalid_watch_progress_event");
  });

  it("runs watch progress runtime", () => {
    const results = runWatchProgressRuntime([event]);

    expect(results).toHaveLength(1);
    expect(results[0].itemId).toBe("video_001");
  });
});
