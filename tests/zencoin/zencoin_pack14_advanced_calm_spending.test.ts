import { describe, expect, it } from "vitest";
import {
  advancedCalmSpending,
  purchaseSpacingAllowed,
  largePurchaseCooldownRequired,
  advancedCalmSpendingHealthy
} from "@/core/zencoin/spending/advancedCalmSpending";

describe("Zencoin Pack 14 — Advanced Calm Spending", () => {
  it("blocks pressure commerce patterns", () => {
    expect(advancedCalmSpending.noUrgencyCommerce).toBe(true);
    expect(advancedCalmSpending.noFakeScarcity).toBe(true);
  });

  it("supports cooldown rules", () => {
    expect(purchaseSpacingAllowed({ secondsSinceLastPurchase: 10 })).toBe(false);
    expect(purchaseSpacingAllowed({ secondsSinceLastPurchase: 30 })).toBe(true);
    expect(largePurchaseCooldownRequired(25)).toBe(true);
    expect(largePurchaseCooldownRequired(5)).toBe(false);
  });

  it("supports advanced calm spending health", () => {
    expect(advancedCalmSpendingHealthy()).toBe(true);
  });
});
