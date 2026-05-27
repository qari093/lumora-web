import { describe, expect, it } from "vitest";

import {
  validateSecuritySeal,
  validateRecoveryNode,
  validateDeploymentRuntime
} from "@/src/core/lumaspace/deployment/contracts/deploymentContract";

import {
  createSecuritySeal
} from "@/src/core/lumaspace/deployment/security/securitySeal";

import {
  createRecoveryNode
} from "@/src/core/lumaspace/deployment/runtime/recoveryNode";

import {
  runDeploymentRuntime
} from "@/src/core/lumaspace/deployment/runtime/deploymentRuntime";

describe("LumaSpace Deployment Hardening Activation", () => {
  it("creates security seal", () => {
    expect(
      validateSecuritySeal(createSecuritySeal())
    ).toBe(true);
  });

  it("creates recovery node", () => {
    expect(
      validateRecoveryNode(createRecoveryNode())
    ).toBe(true);
  });

  it("runs deployment runtime", () => {
    expect(
      validateDeploymentRuntime(runDeploymentRuntime())
    ).toBe(true);
  });
});
