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

describe("LumaSpace Sanctuary Monetization Activation", () => {
  it("creates sanctuary tier", () => {
    expect(
      validateSanctuaryTier(createSanctuaryTier())
    ).toBe(true);
  });

  it("creates aura enhancement", () => {
    expect(
      validateAuraEnhancement(createAuraEnhancement())
    ).toBe(true);
  });

  it("runs sanctuary runtime", () => {
    expect(
      validateSanctuaryRuntime(runSanctuaryRuntime())
    ).toBe(true);
  });
});
