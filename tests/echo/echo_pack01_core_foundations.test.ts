import { describe, expect, it } from "vitest";
import { echoRuntimeFoundation, runtimeReady } from "../../src/echo/runtime/runtimeFoundation";
import { audioSessionArchitecture, sessionHealthy } from "../../src/echo/audio/audioSession";
import { playbackLifecycle, supportsPlaybackLifecycle } from "../../src/echo/audio/playbackLifecycle";

describe("Echo Pack 01 — Core Foundations", () => {
  it("supports runtime foundation", () => {
    expect(echoRuntimeFoundation.runtime).toBe("echo-core");
    expect(runtimeReady()).toBe(true);
  });

  it("supports audio sessions", () => {
    expect(audioSessionArchitecture.playback).toBe(true);
    expect(sessionHealthy()).toBe(true);
  });

  it("supports playback lifecycle", () => {
    expect(playbackLifecycle).toContain("playing");
    expect(supportsPlaybackLifecycle()).toBe(true);
  });
});
