import { describe, expect, it } from "vitest";
import {
  calculateRenderBudget,
  gmarArtAudioFoundation,
  resolveAssetTier,
  resolveAudioMood,
  validateGmarArtAudioFoundation
} from "../../../src/core/gmar/production/art-audio/foundation";

describe("GMAR Production Phase 1 — Real Art & Audio Foundation", () => {
  it("locks all art/audio foundation contracts", () => {
    expect(validateGmarArtAudioFoundation()).toBe(true);
    expect(gmarArtAudioFoundation.finalSeal).toBe(true);
  });

  it("resolves production asset tier", () => {
    expect(resolveAssetTier(95)).toBe("cinematic");
    expect(resolveAssetTier(75)).toBe("production");
    expect(resolveAssetTier(40)).toBe("prototype");
  });

  it("resolves adaptive audio mood", () => {
    expect(resolveAudioMood(10)).toBe("calm");
    expect(resolveAudioMood(50)).toBe("combat");
    expect(resolveAudioMood(90)).toBe("victory");
  });

  it("protects mobile render budget", () => {
    expect(calculateRenderBudget(40).shaderMode).toBe("lofi-soul");
    expect(calculateRenderBudget(90).targetFps).toBe(60);
    expect(calculateRenderBudget(20).thermalSafe).toBe(true);
  });
});
