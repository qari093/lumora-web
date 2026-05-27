import { describe, expect, it } from "vitest";

import {
  validateCivilizationCompletion,
  validateOmegaSeal,
  validateFinalCivilizationRuntime
} from "@/src/core/lumaspace/final/contracts/finalCivilizationContract";

import {
  createCivilizationCompletion
} from "@/src/core/lumaspace/final/validation/civilizationCompletion";

import {
  createOmegaSeal
} from "@/src/core/lumaspace/final/runtime/omegaSeal";

import {
  runFinalCivilizationRuntime
} from "@/src/core/lumaspace/final/runtime/finalCivilizationRuntime";

describe("LumaSpace Final Civilization Seal Activation", () => {
  it("creates civilization completion", () => {
    expect(
      validateCivilizationCompletion(createCivilizationCompletion())
    ).toBe(true);
  });

  it("creates omega seal", () => {
    expect(
      validateOmegaSeal(createOmegaSeal())
    ).toBe(true);
  });

  it("runs final civilization runtime", () => {
    expect(
      validateFinalCivilizationRuntime(runFinalCivilizationRuntime())
    ).toBe(true);
  });
});
