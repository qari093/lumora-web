import { describe, expect, it } from "vitest";

import {
  validateProductionSealInput
} from "@/src/core/fyp/production-seal/contracts/productionSealContract";

import {
  evaluateProductionSeal
} from "@/src/core/fyp/production-seal/runtime/productionSealEvaluator";

import {
  runProductionSealRuntime
} from "@/src/core/fyp/production-seal/runtime/productionSealRuntime";

const input = {
  pack: 70,
  total: 72,
  typecheckPassed: true,
  testsPassed: true,
  runtimeClean: true
};

describe("Lumora FYP Production Seal Runtime Activation", () => {
  it("validates production seal input", () => {
    expect(validateProductionSealInput(input)).toBe(true);
  });

  it("seals clean production runtime", () => {
    const result = evaluateProductionSeal(input);

    expect(result.ok).toBe(true);
    expect(result.sealed).toBe(true);
  });

  it("scores full seal as 100", () => {
    const result = evaluateProductionSeal(input);

    expect(result.score).toBe(100);
  });

  it("blocks incomplete seal", () => {
    const result = evaluateProductionSeal({
      ...input,
      runtimeClean: false
    });

    expect(result.sealed).toBe(false);
    expect(result.reason).toBe("production_seal_blocked");
  });

  it("runs production seal runtime", () => {
    const result = runProductionSealRuntime(input);

    expect(result.reason).toBe("production_seal_ready");
  });
});
