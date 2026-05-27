import { describe, expect, it } from "vitest";
import { dspRuntime, morphRuntimeHealthy } from "../../src/echo/morph/dspRuntime";
import { morphSafetyGuardian } from "../../src/echo/morph/safetyGuardian";
import { seasonalMorphPresets } from "../../src/echo/morph/seasonalPresets";
import { originalRestoreMode } from "../../src/echo/morph/originalRestore";

describe("Echo Pack 03 — Morph Engine", () => {
  it("supports DSP runtime", () => {
    expect(dspRuntime.eq).toBe(true);
    expect(morphRuntimeHealthy()).toBe(true);
  });

  it("supports morph safety", () => {
    expect(morphSafetyGuardian().vocalProtection).toBe(true);
  });

  it("supports seasonal presets and restore", () => {
    expect(seasonalMorphPresets).toContain("winter-stillness");
    expect(originalRestoreMode().available).toBe(true);
  });
});
