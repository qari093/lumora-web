import { describe, expect, it } from "vitest";

import {
  validateRuntimeMatrix,
  validatePackSeal,
  validateRuntimeSeal
} from "@/src/core/lumaspace/runtime-seal/contracts/runtimeSealContract";

import {
  createRuntimeMatrix
} from "@/src/core/lumaspace/runtime-seal/validation/runtimeMatrix";

import {
  createPackSeal
} from "@/src/core/lumaspace/runtime-seal/runtime/packSeal";

import {
  runRuntimeSeal
} from "@/src/core/lumaspace/runtime-seal/runtime/runtimeSeal";

describe("LumaSpace Runtime Sealing Activation", () => {
  it("creates runtime matrix", () => {
    expect(
      validateRuntimeMatrix(createRuntimeMatrix())
    ).toBe(true);
  });

  it("creates pack seal", () => {
    expect(
      validatePackSeal(createPackSeal())
    ).toBe(true);
  });

  it("runs runtime seal", () => {
    expect(
      validateRuntimeSeal(runRuntimeSeal())
    ).toBe(true);
  });
});
