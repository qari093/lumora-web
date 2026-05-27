import { describe, expect, it } from "vitest";

import {
  validateCivilizationEpoch,
  validateResonanceMutation,
  validateEvolutionRuntime
} from "@/src/core/lumaspace/evolution/contracts/evolutionContract";

import {
  createCivilizationEpoch
} from "@/src/core/lumaspace/evolution/civilization/civilizationEpoch";

import {
  createResonanceMutation
} from "@/src/core/lumaspace/evolution/runtime/resonanceMutation";

import {
  runEvolutionRuntime
} from "@/src/core/lumaspace/evolution/runtime/evolutionRuntime";

describe("LumaSpace Evolution Engine Activation", () => {
  it("creates civilization epoch", () => {
    expect(
      validateCivilizationEpoch(createCivilizationEpoch())
    ).toBe(true);
  });

  it("creates resonance mutation", () => {
    expect(
      validateResonanceMutation(createResonanceMutation())
    ).toBe(true);
  });

  it("runs evolution runtime", () => {
    expect(
      validateEvolutionRuntime(runEvolutionRuntime())
    ).toBe(true);
  });
});
