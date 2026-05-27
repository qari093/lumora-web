import { describe, expect, it } from "vitest";

import {
  validateShorelineSpark,
  validateGravityWell,
  validateShorelineRuntime
} from "@/src/core/lumaspace/shoreline/contracts/shorelineContract";

import {
  createGravityWell
} from "@/src/core/lumaspace/shoreline/runtime/gravityWell";

import {
  runShorelineRuntime
} from "@/src/core/lumaspace/shoreline/runtime/shorelineRuntime";

describe("LumaSpace Shoreline Discovery Activation", () => {
  it("validates shoreline spark", () => {
    expect(
      validateShorelineSpark({
        id: "spark_001",
        emotion: "wonder"
      })
    ).toBe(true);
  });

  it("creates gravity well", () => {
    expect(
      validateGravityWell(createGravityWell())
    ).toBe(true);
  });

  it("runs shoreline runtime", () => {
    expect(
      validateShorelineRuntime(runShorelineRuntime())
    ).toBe(true);
  });
});
