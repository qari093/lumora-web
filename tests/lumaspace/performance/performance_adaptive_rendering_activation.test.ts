import { describe, expect, it } from "vitest";

import {
  validateRenderProfile,
  validateDeviceCapability,
  validatePerformanceRuntime
} from "@/src/core/lumaspace/performance/contracts/performanceContract";

import {
  createRenderProfile
} from "@/src/core/lumaspace/performance/rendering/renderProfile";

import {
  createDeviceCapability
} from "@/src/core/lumaspace/performance/runtime/deviceCapability";

import {
  runPerformanceRuntime
} from "@/src/core/lumaspace/performance/runtime/performanceRuntime";

describe("LumaSpace Performance Adaptive Rendering Activation", () => {
  it("creates render profile", () => {
    expect(
      validateRenderProfile(createRenderProfile())
    ).toBe(true);
  });

  it("creates device capability", () => {
    expect(
      validateDeviceCapability(createDeviceCapability())
    ).toBe(true);
  });

  it("runs performance runtime", () => {
    expect(
      validatePerformanceRuntime(runPerformanceRuntime())
    ).toBe(true);
  });
});
