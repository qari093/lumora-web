import { describe, expect, it } from "vitest";
import { evaluateBalanceSigil } from "../../src/live/governance/balanceSigilCore";
import { passesHalfShipRule, passesOneBreathRule } from "../../src/live/governance/governanceRules";
import { passesPulseSphereBudget } from "../../src/live/seal/performanceBudget";
import { canApplyFinalOmegaSeal } from "../../src/live/seal/finalOmegaSeal";

describe("Lumora Live Pack 13 — Final Seal", () => {
  it("evaluates Balance Sigil safely", () => {
    expect(evaluateBalanceSigil({
      presenceRatio: 70,
      momentumRatio: 20,
      mythologyRatio: 10,
    })).toBe("healthy");

    expect(evaluateBalanceSigil({
      presenceRatio: 50,
      momentumRatio: 40,
      mythologyRatio: 10,
    })).toBe("overstimulated");
  });

  it("enforces governance rules", () => {
    expect(passesOneBreathRule(5)).toBe(true);
    expect(passesOneBreathRule(6)).toBe(false);
    expect(passesHalfShipRule(3)).toBe(true);
    expect(passesHalfShipRule(2)).toBe(false);
  });

  it("enforces PulseSphere performance budget", () => {
    expect(passesPulseSphereBudget({ memoryMb: 45, cpuPercent: 5 })).toBe(true);
    expect(passesPulseSphereBudget({ memoryMb: 46, cpuPercent: 5 })).toBe(false);
  });

  it("allows final Ω∞ seal only after locks, tests, and performance pass", () => {
    expect(canApplyFinalOmegaSeal({
      packLocks: ["pack11", "pack12", "pack13"],
      requiredLocks: ["pack11", "pack12", "pack13"],
      testsPassed: true,
      performancePassed: true,
    })).toBe(true);
  });
});
