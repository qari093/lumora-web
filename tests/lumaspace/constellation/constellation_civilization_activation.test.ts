import { describe, expect, it } from "vitest";

import {
  validateConstellation,
  validateAuraBloom,
  validateConstellationRuntime
} from "@/src/core/lumaspace/constellation/contracts/constellationContract";

import {
  createAuraBloom
} from "@/src/core/lumaspace/constellation/runtime/auraBloom";

import {
  runConstellationRuntime
} from "@/src/core/lumaspace/constellation/runtime/constellationRuntime";

describe("LumaSpace Constellation Civilization Activation", () => {
  it("validates constellation", () => {
    expect(
      validateConstellation({
        id: "constellation_001",
        members: 8
      })
    ).toBe(true);
  });

  it("creates aura bloom", () => {
    expect(
      validateAuraBloom(createAuraBloom())
    ).toBe(true);
  });

  it("runs constellation runtime", () => {
    expect(
      validateConstellationRuntime(runConstellationRuntime())
    ).toBe(true);
  });
});
