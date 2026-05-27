import { describe, expect, it } from "vitest";

import {
  FOUNDATION_LOCKS,
  assertFoundationIntegrity
} from "@/src/core/fyp/foundation/registry";

import {
  assertDoctrineLocked,
  validateGovernance
} from "@/src/core/fyp/governance/governance";

describe("Lumora FYP Foundation Lock", () => {
  it("locks governance doctrine", () => {
    expect(assertDoctrineLocked()).toBe(true);
  });

  it("validates governance", () => {
    expect(validateGovernance()).toBe(true);
  });

  it("validates foundation integrity", () => {
    expect(assertFoundationIntegrity()).toBe(true);
  });

  it("ensures all foundation locks are enabled", () => {
    expect(
      Object.values(FOUNDATION_LOCKS).every(Boolean)
    ).toBe(true);
  });
});
