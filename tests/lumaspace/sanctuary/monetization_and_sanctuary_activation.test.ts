import { describe, expect, it } from "vitest";

import {
  validateSanctuaryTier,
  validateAuraEnhancement,
  validateSanctuaryRuntime
} from "@/src/core/lumaspace/sanctuary/contracts/sanctuaryContract";

import {
  createSanctuaryTier
} from "@/src/core/lumaspace/sanctuary/economy/sanctuaryTier";

import {
  createAuraEnhancement
} from "@/src/core/lumaspace/sanctuary/runtime/auraEnhancement";

import {
  runSanctuaryRuntime
} from "@/src/core/lumaspace/sanctuary/runtime/sanctuaryRuntime";

describe("LumaSpace Monetization and Sanctuary Activation", () => {
  it("creates sanctuary tier", () => {
    const tier = createSanctuaryTier();

    expect(
      validateSanctuaryTier(tier)
    ).toBe(true);
  });

  it("creates aura enhancement", () => {
    const enhancement = createAuraEnhancement();

    expect(
      validateAuraEnhancement(enhancement)
    ).toBe(true);
  });

  it("runs sanctuary runtime", () => {
    const runtime = runSanctuaryRuntime();

    expect(
      validateSanctuaryRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.enhancement.id
    ).toBe("enhancement_001");
  });
});
