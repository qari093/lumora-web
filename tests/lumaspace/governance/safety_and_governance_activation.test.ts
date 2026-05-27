import { describe, expect, it } from "vitest";

import {
  validateSafetyBoundary,
  validateGovernanceSignal,
  validateGovernanceRuntime
} from "@/src/core/lumaspace/governance/contracts/governanceContract";

import {
  createSafetyBoundary
} from "@/src/core/lumaspace/governance/safety/safetyBoundary";

import {
  createGovernanceSignal
} from "@/src/core/lumaspace/governance/runtime/governanceSignal";

import {
  runGovernanceRuntime
} from "@/src/core/lumaspace/governance/runtime/governanceRuntime";

describe("LumaSpace Safety and Governance Activation", () => {
  it("creates safety boundary", () => {
    const boundary = createSafetyBoundary();

    expect(
      validateSafetyBoundary(boundary)
    ).toBe(true);
  });

  it("creates governance signal", () => {
    const signal = createGovernanceSignal();

    expect(
      validateGovernanceSignal(signal)
    ).toBe(true);
  });

  it("runs governance runtime", () => {
    const runtime = runGovernanceRuntime();

    expect(
      validateGovernanceRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.boundary.id
    ).toBe("boundary_001");
  });
});
