import { describe, expect, it } from "vitest";

import {
  validateHeroFrame,
  validateAuraPipeline,
  validateAiRuntime
} from "@/src/core/lumaspace/ai/contracts/aiContract";

import {
  createHeroFrame
} from "@/src/core/lumaspace/ai/media/heroFrame";

import {
  createAuraPipeline
} from "@/src/core/lumaspace/ai/runtime/auraPipeline";

import {
  runAiRuntime
} from "@/src/core/lumaspace/ai/runtime/aiRuntime";

describe("LumaSpace AI Media Pipelines Activation", () => {
  it("creates hero frame", () => {
    expect(
      validateHeroFrame(createHeroFrame())
    ).toBe(true);
  });

  it("creates aura pipeline", () => {
    expect(
      validateAuraPipeline(createAuraPipeline())
    ).toBe(true);
  });

  it("runs ai runtime", () => {
    expect(
      validateAiRuntime(runAiRuntime())
    ).toBe(true);
  });
});
