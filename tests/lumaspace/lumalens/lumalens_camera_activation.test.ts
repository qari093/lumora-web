import { describe, expect, it } from "vitest";

import {
  validateLensFrame,
  validateRawLens,
  validateTwinSpark
} from "@/src/core/lumaspace/lumalens/contracts/lumalensContract";

import {
  createLensFrame
} from "@/src/core/lumaspace/lumalens/render/lensComposer";

import {
  createRawLens
} from "@/src/core/lumaspace/lumalens/runtime/rawLens";

import {
  createTwinSpark
} from "@/src/core/lumaspace/lumalens/runtime/twinSpark";

import {
  runLumaLensRuntime
} from "@/src/core/lumaspace/lumalens/runtime/lumalensRuntime";

describe("LumaSpace LumaLens Camera Activation", () => {
  it("creates lens frame", () => {
    const frame = createLensFrame("dream");

    expect(
      validateLensFrame(frame)
    ).toBe(true);
  });

  it("creates raw lens", () => {
    const rawLens = createRawLens();

    expect(
      validateRawLens(rawLens)
    ).toBe(true);
  });

  it("creates twin spark", () => {
    const twinSpark = createTwinSpark();

    expect(
      validateTwinSpark(twinSpark)
    ).toBe(true);
  });

  it("runs lumalens runtime", () => {
    const runtime = runLumaLensRuntime();

    expect(
      runtime.frame.id
    ).toBe("frame_001");

    expect(
      runtime.rawLens.enabled
    ).toBe(true);

    expect(
      runtime.twinSpark.leftId
    ).toBe("user_001");
  });
});
