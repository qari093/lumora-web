import { describe, expect, it } from "vitest";

import {
  validateMediaAsset
} from "@/src/core/fyp/media-runtime/mediaValidation";

import {
  createFeedPlaybackState
} from "@/src/core/fyp/video-runtime/playback";

import {
  createPreloadPlan
} from "@/src/core/fyp/video-runtime/preload";

import {
  createStreamingProfile
} from "@/src/core/fyp/video-runtime/streaming";

import {
  createMediaTelemetryEvent
} from "@/src/core/fyp/media-runtime/mediaTelemetry";

import {
  createMediaRuntimeSeal
} from "@/src/core/fyp/media-runtime/mediaRuntimeSeal";

import type {
  MediaAsset
} from "@/src/core/fyp/media-runtime/types";

describe("Lumora FYP Video + Media Runtime Activation", () => {
  const asset: MediaAsset = {
    assetId: "asset_1",
    kind: "video",
    url: "https://cdn.lumora.test/asset_1.mp4",
    durationSeconds: 30,
    hasAudio: true,
    width: 1080,
    height: 1920,
    bitrateKbps: 2800,
    signed: true
  };

  it("validates playable media asset", () => {
    const decision = validateMediaAsset(asset);

    expect(decision.playable).toBe(true);
    expect(decision.preferredQuality).toBe("high");
  });

  it("rejects video without audio track", () => {
    const decision = validateMediaAsset({
      ...asset,
      assetId: "asset_no_audio",
      hasAudio: false
    });

    expect(decision.playable).toBe(false);
    expect(decision.reason).toBe("video_requires_audio_track");
  });

  it("creates feed playback state", () => {
    const state = createFeedPlaybackState({
      asset,
      userMutedDefault: true
    });

    expect(state.autoplay).toBe(true);
    expect(state.preload).toBe("metadata");
    expect(state.safeForFeed).toBe(true);
  });

  it("creates preload plan and streaming profile", () => {
    const preload = createPreloadPlan({
      asset,
      networkMbps: 10
    });

    const streaming = createStreamingProfile(asset);

    expect(preload.bandwidthProtected).toBe(true);
    expect(preload.preloadNext).toBe(true);
    expect(streaming.adaptive).toBe(true);
    expect(streaming.ladder).toContain("1080p");
  });

  it("creates media telemetry event", () => {
    const event = createMediaTelemetryEvent({
      assetId: "asset_1",
      event: "complete"
    });

    expect(event.event).toBe("complete");
    expect(event.value).toBe(1);
  });

  it("creates media runtime seal", () => {
    const decisions = [
      validateMediaAsset(asset),
      validateMediaAsset({
        ...asset,
        assetId: "asset_2",
        bitrateKbps: 900
      })
    ];

    const seal = createMediaRuntimeSeal(decisions);

    expect(seal.checked).toBe(2);
    expect(seal.playable).toBe(2);
    expect(seal.ready).toBe(true);
  });
});
