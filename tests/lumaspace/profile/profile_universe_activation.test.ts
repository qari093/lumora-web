import { describe, expect, it } from "vitest";

import {
  validateHeroSpark,
  validateTimelineWave,
  validateProfileRuntime
} from "@/src/core/lumaspace/profile/contracts/profileContract";

import {
  createTimelineWave
} from "@/src/core/lumaspace/profile/render/timelineWave";

import {
  runProfileRuntime
} from "@/src/core/lumaspace/profile/runtime/profileRuntime";

describe("LumaSpace Profile Universe Activation", () => {
  it("validates hero spark", () => {
    expect(
      validateHeroSpark({
        id: "hero_001",
        aura: "violet-bloom"
      })
    ).toBe(true);
  });

  it("creates timeline wave", () => {
    expect(
      validateTimelineWave(createTimelineWave())
    ).toBe(true);
  });

  it("runs profile runtime", () => {
    expect(
      validateProfileRuntime(runProfileRuntime())
    ).toBe(true);
  });
});
