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

describe("LumaSpace Performance and Adaptive Rendering Activation", () => {
  it("creates render profile", () => {
    const profile = createRenderProfile();

    expect(
      validateRenderProfile(profile)
    ).toBe(true);
  });

  it("creates device capability", () => {
    const capability = createDeviceCapability();

    expect(
      validateDeviceCapability(capability)
    ).toBe(true);
  });

  it("runs performance runtime", () => {
    const runtime = runPerformanceRuntime();

    expect(
      validatePerformanceRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.profile.fpsTarget
    ).toBe(60);
  });
});
