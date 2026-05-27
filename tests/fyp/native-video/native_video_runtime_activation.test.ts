import { describe, expect, it } from "vitest";

import { validateNativeVideoAsset } from "@/src/core/fyp/native-video/contracts/nativeVideoContract";
import { evaluateNativeVideo } from "@/src/core/fyp/native-video/runtime/nativeVideoPolicy";
import { runNativeVideoRuntime } from "@/src/core/fyp/native-video/runtime/nativeVideoRuntime";

const asset = {
  id: "video_001",
  src: "/videos/seed.mp4",
  poster: "/icon",
  durationMs: 15000,
  hasAudio: true
};

describe("Lumora FYP Native Video Runtime Activation", () => {
  it("validates native video asset", () => {
    expect(validateNativeVideoAsset(asset)).toBe(true);
  });

  it("marks playable asset as ready", () => {
    const state = evaluateNativeVideo(asset);

    expect(state.canPlay).toBe(true);
    expect(state.state).toBe("ready");
  });

  it("blocks video without audio", () => {
    const state = evaluateNativeVideo({
      ...asset,
      hasAudio: false
    });

    expect(state.canPlay).toBe(false);
    expect(state.reason).toBe("audio_required");
  });

  it("rejects invalid asset", () => {
    expect(() =>
      evaluateNativeVideo({
        ...asset,
        durationMs: 0
      })
    ).toThrow("invalid_native_video_asset");
  });

  it("runs native video runtime", () => {
    const states = runNativeVideoRuntime([asset]);

    expect(states).toHaveLength(1);
    expect(states[0].reason).toBe("native_video_ready");
  });
});
