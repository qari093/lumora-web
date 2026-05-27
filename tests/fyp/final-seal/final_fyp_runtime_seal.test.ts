import { describe, expect, it } from "vitest";

import {
  validateFinalFypRuntimeSealInput
} from "@/src/core/fyp/final-seal/contracts/finalFypRuntimeSealContract";

import {
  evaluateFinalFypRuntimeSeal
} from "@/src/core/fyp/final-seal/runtime/finalFypRuntimeSealEvaluator";

import {
  runFinalFypRuntimeSeal
} from "@/src/core/fyp/final-seal/runtime/finalFypRuntimeSealRuntime";

const input = {
  totalPacks: 72,
  completedPacks: 72,
  runtimeMatrixReady: true,
  productionSealReady: true
};

describe("Lumora FYP Final Runtime Seal", () => {
  it("validates final seal input", () => {
    expect(validateFinalFypRuntimeSealInput(input)).toBe(true);
  });

  it("seals completed FYP runtime", () => {
    const result = evaluateFinalFypRuntimeSeal(input);

    expect(result.ok).toBe(true);
    expect(result.sealed).toBe(true);
  });

  it("sets completion rate to 1", () => {
    const result = evaluateFinalFypRuntimeSeal(input);

    expect(result.completionRate).toBe(1);
  });

  it("blocks incomplete runtime seal", () => {
    const result = evaluateFinalFypRuntimeSeal({
      ...input,
      completedPacks: 71
    });

    expect(result.sealed).toBe(false);
    expect(result.status).toBe("final_fyp_runtime_incomplete");
  });

  it("runs final FYP runtime seal", () => {
    const result = runFinalFypRuntimeSeal(input);

    expect(result.status).toBe("final_fyp_runtime_sealed");
  });
});
