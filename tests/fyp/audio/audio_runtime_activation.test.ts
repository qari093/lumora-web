import { describe, expect, it } from "vitest";

import {
  validateAudioAsset
} from "@/src/core/fyp/audio/contracts/audioContract";

import {
  evaluateAudioAsset
} from "@/src/core/fyp/audio/runtime/audioPolicy";

import {
  runAudioRuntime
} from "@/src/core/fyp/audio/runtime/audioRuntime";

const asset = {
  id: "audio_001",
  src: "/audio/seed.aac",
  durationMs: 15000,
  codec: "aac",
  normalized: false
};

describe("Lumora FYP Audio Runtime Activation", () => {
  it("validates audio asset", () => {
    expect(validateAudioAsset(asset)).toBe(true);
  });

  it("accepts supported audio", () => {
    const decision = evaluateAudioAsset(asset);

    expect(decision.usable).toBe(true);
    expect(decision.reason).toBe("audio_ready");
  });

  it("requires normalization when not normalized", () => {
    const decision = evaluateAudioAsset(asset);

    expect(decision.normalizeRequired).toBe(true);
  });

  it("blocks unsupported codec", () => {
    const decision = evaluateAudioAsset({
      ...asset,
      codec: "wav"
    });

    expect(decision.usable).toBe(false);
    expect(decision.reason).toBe("unsupported_codec");
  });

  it("runs audio runtime", () => {
    const decisions = runAudioRuntime([asset]);

    expect(decisions).toHaveLength(1);
    expect(decisions[0].usable).toBe(true);
  });
});
