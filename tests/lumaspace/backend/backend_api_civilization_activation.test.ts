import { describe, expect, it } from "vitest";

import {
  validateCivilizationSurface,
  validateRuntimeBridge,
  validateBackendRuntime
} from "@/src/core/lumaspace/backend/contracts/backendContract";

import {
  createRuntimeSurface
} from "@/src/core/lumaspace/backend/api/runtimeSurface";

import {
  createRuntimeBridge
} from "@/src/core/lumaspace/backend/runtime/runtimeBridge";

import {
  runBackendRuntime
} from "@/src/core/lumaspace/backend/runtime/backendRuntime";

describe("LumaSpace Backend API Civilization Activation", () => {
  it("creates runtime surface", () => {
    expect(
      validateCivilizationSurface(createRuntimeSurface())
    ).toBe(true);
  });

  it("creates runtime bridge", () => {
    expect(
      validateRuntimeBridge(createRuntimeBridge())
    ).toBe(true);
  });

  it("runs backend runtime", () => {
    expect(
      validateBackendRuntime(runBackendRuntime())
    ).toBe(true);
  });
});
