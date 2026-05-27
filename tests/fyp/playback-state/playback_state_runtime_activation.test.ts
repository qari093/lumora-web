import { describe, expect, it } from "vitest";

import {
  isPlaybackStatus,
  validatePlaybackState
} from "@/src/core/fyp/playback-state/contracts/playbackStateContract";

import {
  calculatePlaybackProgress
} from "@/src/core/fyp/playback-state/runtime/playbackProgress";

import {
  runPlaybackStateRuntime
} from "@/src/core/fyp/playback-state/runtime/playbackStateRuntime";

const state = {
  itemId: "video_001",
  status: "playing" as const,
  positionMs: 5000,
  durationMs: 10000,
  muted: false
};

describe("Lumora FYP Playback State Runtime Activation", () => {
  it("validates playback status", () => {
    expect(isPlaybackStatus("playing")).toBe(true);
    expect(isPlaybackStatus("broken")).toBe(false);
  });

  it("validates playback state", () => {
    expect(validatePlaybackState(state)).toBe(true);
  });

  it("calculates playback progress", () => {
    const progress = calculatePlaybackProgress(state);

    expect(progress.progress).toBe(0.5);
    expect(progress.complete).toBe(false);
  });

  it("marks near-complete playback", () => {
    const progress = calculatePlaybackProgress({
      ...state,
      positionMs: 9600
    });

    expect(progress.complete).toBe(true);
  });

  it("runs playback state runtime", () => {
    const results = runPlaybackStateRuntime([state]);

    expect(results).toHaveLength(1);
    expect(results[0].itemId).toBe("video_001");
  });
});
