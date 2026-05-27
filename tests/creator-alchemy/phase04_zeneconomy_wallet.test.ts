import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  appendZenEconomyEntry,
  buildCreatorEconomyRuntime,
  buildCreatorStorefrontBridge,
  calculateZenEconomyBalance,
  createCreatorUtilityItem,
  validateCreatorUtilityItem,
  validatePatronageRuntime
} from "@/src/core/creator-alchemy/zeneconomy";

describe("Phase 04 — ZenEconomy + Wallet Evolution Ω", () => {
  it("persists ZenEconomy ledger entries", () => {
    appendZenEconomyEntry({
      id: "zen-1",
      creatorId: "creator-z",
      asset: "quiet_coin",
      amount: 1000,
      reason: "quiet_gift_received",
      createdAt: "2026-01-01T00:00:00.000Z"
    });

    expect(calculateZenEconomyBalance("creator-z")).toBeGreaterThanOrEqual(1000);
  });

  it("builds creator economy runtime", () => {
    const runtime = buildCreatorEconomyRuntime({
      creatorId: "creator-z",
      fraudCleared: true,
      creatorVerified: true,
      commerceSafetyPassed: true
    });

    expect(runtime.payoutEligible).toBe(true);
    expect(runtime.patronageEligible).toBe(true);
    expect(runtime.storefrontEligible).toBe(true);
  });

  it("validates soft constellation patronage", () => {
    expect(
      validatePatronageRuntime({
        constellation: "Midnight Souls",
        sponsorName: "Calm Studio",
        copy: "This week is quietly supported so creators can breathe.",
        approved: true
      })
    ).toBe(true);

    expect(
      validatePatronageRuntime({
        constellation: "Midnight Souls",
        sponsorName: "Bad Growth",
        copy: "Guaranteed jackpot buy reach.",
        approved: true
      })
    ).toBe(false);
  });

  it("builds Zendoro storefront bridge safely", () => {
    const bridge = buildCreatorStorefrontBridge({
      creatorId: "creator-z",
      enabled: true,
      zendoroReady: true,
      commerceSafetyPassed: true
    });

    expect(bridge.enabled).toBe(true);
  });

  it("keeps creator utilities non pay-to-win", () => {
    const item = createCreatorUtilityItem({
      id: "item-1",
      asset: "creator_cosmetic",
      cost: 120
    });

    expect(validateCreatorUtilityItem(item)).toBe(true);
    expect(item.payToWin).toBe(false);
  });

  it("creates ZenEconomy API route", () => {
    expect(existsSync("app/api/creator-alchemy/zeneconomy/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/zeneconomy/route.ts", "utf8")).toContain("buildCreatorEconomyRuntime");
  });
});
