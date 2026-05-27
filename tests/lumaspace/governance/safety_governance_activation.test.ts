import { describe, expect, it } from "vitest";

import {
  validateSafetyBoundary,
  validateConsentLayer,
  validateGovernanceRuntime
} from "@/src/core/lumaspace/governance/contracts/governanceContract";

import {
  createSafetyBoundary
} from "@/src/core/lumaspace/governance/safety/safetyBoundary";

import {
  createConsentLayer
} from "@/src/core/lumaspace/governance/safety/consentLayer";

import {
  runGovernanceRuntime
} from "@/src/core/lumaspace/governance/runtime/governanceRuntime";

describe("LumaSpace Safety Governance Activation", () => {
  it("creates safety boundary", () => {
    expect(
      validateSafetyBoundary(createSafetyBoundary())
    ).toBe(true);
  });

  it("creates consent layer", () => {
    expect(
      validateConsentLayer(createConsentLayer())
    ).toBe(true);
  });

  it("runs governance runtime", () => {
    expect(
      validateGovernanceRuntime(runGovernanceRuntime())
    ).toBe(true);
  });
});
