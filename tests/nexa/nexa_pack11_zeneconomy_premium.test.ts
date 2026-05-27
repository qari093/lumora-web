import { describe, expect, it } from "vitest";
import {
  zenEconomyPremium,
  zenEconomyPremiumHealthy
} from "../../src/core/nexa/economy/final/zenEconomyPremium";

describe("NEXA Pack 11/12 — ZenEconomy + Premium", () => {
  it("supports premium systems", () => {
    expect(zenEconomyPremium.premiumRuntime).toBe(true);
    expect(zenEconomyPremium.subscriptionValidation).toBe(true);
    expect(zenEconomyPremium.nexaEchoBundle).toBe(true);
  });

  it("supports Zencoin bridge", () => {
    expect(zenEconomyPremium.zencoinBridge).toBe(true);
    expect(zenEconomyPremium.creatorPackRuntime).toBe(true);
  });

  it("supports ethical monetization", () => {
    expect(zenEconomyPremium.calmSpendingRules).toBe(true);
    expect(zenEconomyPremium.noEssentialHealthPaywall).toBe(true);
    expect(zenEconomyPremiumHealthy()).toBe(true);
  });
});
