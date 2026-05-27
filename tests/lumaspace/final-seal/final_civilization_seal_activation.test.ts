import { describe, expect, it } from "vitest";

import {
  validateCivilizationSeal,
  validateRuntimeMatrix,
  validateFinalSealRuntime
} from "@/src/core/lumaspace/final-seal/contracts/finalSealContract";

import {
  createRuntimeMatrix
} from "@/src/core/lumaspace/final-seal/validation/runtimeMatrix";

import {
  createCivilizationSeal
} from "@/src/core/lumaspace/final-seal/runtime/civilizationSeal";

import {
  runFinalSealRuntime
} from "@/src/core/lumaspace/final-seal/runtime/finalSealRuntime";

describe("LumaSpace Final Civilization Seal Activation", () => {
  it("creates runtime matrix", () => {
    const matrix = createRuntimeMatrix();

    expect(
      validateRuntimeMatrix(matrix)
    ).toBe(true);
  });

  it("creates civilization seal", () => {
    const seal = createCivilizationSeal();

    expect(
      validateCivilizationSeal(seal)
    ).toBe(true);
  });

  it("runs final seal runtime", () => {
    const runtime = runFinalSealRuntime();

    expect(
      validateFinalSealRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.seal.status
    ).toBe("lumaspace_civilization_sealed");

    expect(
      runtime.matrix.passed
    ).toBe(22);
  });
});
