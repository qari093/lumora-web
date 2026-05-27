import { describe, expect, it } from "vitest";

import {
  validateLensFrame,
  validateTwinSpark,
  validateLumaLensRuntime
} from "@/src/core/lumaspace/lumalens/contracts/lumalensContract";

import {
  createTwinSpark
} from "@/src/core/lumaspace/lumalens/runtime/twinSpark";

import {
  runLumaLensRuntime
} from "@/src/core/lumaspace/lumalens/runtime/lumalensRuntime";

describe("LumaSpace LumaLens Camera Engine Activation", () => {
  it("validates lens frame", () => {
    expect(
      validateLensFrame({
        id: "frame_001",
        aura: "dreamlight"
      })
    ).toBe(true);
  });

  it("creates twin spark", () => {
    expect(
      validateTwinSpark(createTwinSpark())
    ).toBe(true);
  });

  it("runs lumalens runtime", () => {
    expect(
      validateLumaLensRuntime(runLumaLensRuntime())
    ).toBe(true);
  });
});
