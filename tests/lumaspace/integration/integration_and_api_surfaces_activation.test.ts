import { describe, expect, it } from "vitest";

import {
  validateIntegrationSurface,
  validateRuntimeBridge,
  validateIntegrationRuntime
} from "@/src/core/lumaspace/integration/contracts/integrationContract";

import {
  createIntegrationSurface
} from "@/src/core/lumaspace/integration/api/runtimeSurface";

import {
  createRuntimeBridge
} from "@/src/core/lumaspace/integration/runtime/runtimeBridge";

import {
  runIntegrationRuntime
} from "@/src/core/lumaspace/integration/runtime/integrationRuntime";

describe("LumaSpace Integration and API Surfaces Activation", () => {
  it("creates integration surface", () => {
    const surface = createIntegrationSurface();

    expect(
      validateIntegrationSurface(surface)
    ).toBe(true);
  });

  it("creates runtime bridge", () => {
    const bridge = createRuntimeBridge();

    expect(
      validateRuntimeBridge(bridge)
    ).toBe(true);
  });

  it("runs integration runtime", () => {
    const runtime = runIntegrationRuntime();

    expect(
      validateIntegrationRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.bridge.target
    ).toBe("lumora-core");
  });
});
