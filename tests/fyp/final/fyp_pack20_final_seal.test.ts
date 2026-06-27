import { describe, it, expect } from "vitest";

import {
  evaluateFypOmegaSeal,
  FYP_OMEGA_REQUIRED_LOCKS
} from "../../../src/core/fyp/final/fypOmegaSeal";

import {
  validateFypOmegaReadiness
} from "../../../src/core/fyp/final/fypOmegaReadiness";

describe("FYP Omega Pack 20", () => {
  it("requires locks for packs 01 through 19", () => {
    expect(FYP_OMEGA_REQUIRED_LOCKS.length).toBe(19);
    expect(FYP_OMEGA_REQUIRED_LOCKS[0]).toBe(".fyp_omega_pack01_lock");
    expect(FYP_OMEGA_REQUIRED_LOCKS[18]).toBe(".fyp_omega_pack19_lock");
  });

  it("passes seal when all locks exist", () => {
    const result = evaluateFypOmegaSeal([...FYP_OMEGA_REQUIRED_LOCKS]);

    expect(result.ok).toBe(true);
    expect(result.present).toBe(19);
    expect(result.missing.length).toBe(0);
  });

  it("fails seal when one lock is missing", () => {
    const result = evaluateFypOmegaSeal(
      FYP_OMEGA_REQUIRED_LOCKS.filter(
        lock => lock !== ".fyp_omega_pack10_lock"
      )
    );

    expect(result.ok).toBe(false);
    expect(result.missing).toContain(".fyp_omega_pack10_lock");
  });

  it("validates final readiness map", () => {
    expect(validateFypOmegaReadiness()).toBe(true);
  });
});
