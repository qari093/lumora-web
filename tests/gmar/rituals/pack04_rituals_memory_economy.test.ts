import { describe, expect, it } from "vitest";

import { createMirrorHourState, mirrorHourHealthy } from "../../../src/core/gmar/rituals/mirrorHour";
import { lonelyWorldScriptHealthy, lonelyWorldWhisper } from "../../../src/core/gmar/rituals/lonelyWorld";
import { createWelcomeEchoGift } from "../../../src/core/gmar/rituals/echoGift";
import { gmarEconomyPolicyHealthy, isGmarEconomyUseAllowed } from "../../../src/core/gmar/economy/policy";
import { createSolaceCoin } from "../../../src/core/gmar/economy/solaceCoin";
import { createKeeperOfLight } from "../../../src/core/gmar/economy/keeperOfLight";
import { createMemoryPatronage } from "../../../src/core/gmar/economy/memoryPatronage";
import { createVanishingEchoPolicy, vanishingEchoPolicyHealthy } from "../../../src/core/gmar/fomo/vanishingEcho";

describe("GMAR Pack 04 — Rituals Memory Economy", () => {
  it("validates Mirror Hour", () => {
    const state = createMirrorHourState();

    expect(mirrorHourHealthy(state)).toBe(true);
    expect(state.competitivePaused).toBe(true);
  });

  it("validates lonely world scripts", () => {
    expect(lonelyWorldScriptHealthy()).toBe(true);
    expect(lonelyWorldWhisper("zero_echo_generation")).toContain("Memory");
  });

  it("creates immediate welcome echo gift", () => {
    const gift = createWelcomeEchoGift("Waqar");

    expect(gift.publicViewer).toBe(true);
    expect(gift.loginRequired).toBe(false);
    expect(gift.title).toContain("Waqar");
  });

  it("enforces ethical economy policy", () => {
    expect(gmarEconomyPolicyHealthy()).toBe(true);
    expect(isGmarEconomyUseAllowed("solace_coin")).toBe(true);
    expect(isGmarEconomyUseAllowed("power_boost")).toBe(false);
    expect(isGmarEconomyUseAllowed("loot_box")).toBe(false);
  });

  it("creates Solace Coin without power", () => {
    const coin = createSolaceCoin();

    expect(coin.priceUsd).toBe(4.99);
    expect(coin.power).toBe(0);
    expect(coin.replayFirstLight).toBe(true);
  });

  it("creates Keeper of the Light without exclusive power content", () => {
    const keeper = createKeeperOfLight();

    expect(keeper.monthlyUsd).toBe(2.99);
    expect(keeper.grantsPower).toBe(false);
    expect(keeper.grantsExclusiveContent).toBe(false);
    expect(keeper.haloMote).toBe(true);
  });

  it("creates memory patronage as private devotion", () => {
    const patronage = createMemoryPatronage("first-light");

    expect(patronage.preventsDecay).toBe(true);
    expect(patronage.publicFlex).toBe(false);
    expect(patronage.privateDevotion).toBe(true);
  });

  it("validates Vanishing Echo as beauty-only FOMO", () => {
    const policy = createVanishingEchoPolicy();

    expect(vanishingEchoPolicyHealthy(policy)).toBe(true);
    expect(policy.maxPerMonth).toBe(3);
    expect(policy.powerReward).toBe(false);
  });
});
