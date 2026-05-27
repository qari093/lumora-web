import { describe, expect, it } from "vitest";

import {
  validatePortalCard,
  validateSparkInvite,
  validateGrowthRuntime
} from "@/src/core/lumaspace/growth/contracts/growthContract";

import {
  createPortalCard
} from "@/src/core/lumaspace/growth/portals/portalCard";

import {
  createSparkInvite
} from "@/src/core/lumaspace/growth/runtime/sparkInvite";

import {
  runGrowthRuntime
} from "@/src/core/lumaspace/growth/runtime/growthRuntime";

describe("LumaSpace Growth and Portals Activation", () => {
  it("creates portal card", () => {
    expect(
      validatePortalCard(createPortalCard())
    ).toBe(true);
  });

  it("creates spark invite", () => {
    expect(
      validateSparkInvite(createSparkInvite())
    ).toBe(true);
  });

  it("runs growth runtime", () => {
    expect(
      validateGrowthRuntime(runGrowthRuntime())
    ).toBe(true);
  });
});
