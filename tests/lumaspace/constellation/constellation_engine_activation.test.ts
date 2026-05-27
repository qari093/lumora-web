import { describe, expect, it } from "vitest";

import {
  validateMember,
  validateConstellation,
  validateAuraBloom
} from "@/src/core/lumaspace/constellation/contracts/constellationContract";

import {
  createConstellation
} from "@/src/core/lumaspace/constellation/social/constellationSeed";

import {
  createAuraBloom
} from "@/src/core/lumaspace/constellation/runtime/auraBloom";

import {
  runConstellationRuntime
} from "@/src/core/lumaspace/constellation/runtime/constellationRuntime";

describe("LumaSpace Constellation Engine Activation", () => {
  it("creates valid constellation", () => {
    const constellation = createConstellation();

    expect(
      validateConstellation(constellation)
    ).toBe(true);

    expect(
      validateMember(
        constellation.members[0]
      )
    ).toBe(true);
  });

  it("creates aura bloom", () => {
    const bloom = createAuraBloom("dream");

    expect(
      validateAuraBloom(bloom)
    ).toBe(true);
  });

  it("runs constellation runtime", () => {
    const runtime = runConstellationRuntime();

    expect(
      runtime.constellation.id
    ).toBe("constellation_001");

    expect(
      runtime.bloom.active
    ).toBe(true);
  });
});
