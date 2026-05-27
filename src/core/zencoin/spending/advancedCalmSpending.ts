export const advancedCalmSpending = {
  monthlyCaps: true,
  spendingSummaries: true,
  largePurchaseCooldown: true,
  purchaseSpacingCooldown: true,
  noUrgencyCommerce: true,
  noFakeScarcity: true,
  preferencePersistence: true
} as const;

export function purchaseSpacingAllowed(input: {
  secondsSinceLastPurchase: number;
}): boolean {
  return input.secondsSinceLastPurchase >= 30;
}

export function largePurchaseCooldownRequired(amountEur: number): boolean {
  return amountEur >= 20;
}

export function advancedCalmSpendingHealthy(): boolean {
  return (
    advancedCalmSpending.monthlyCaps &&
    advancedCalmSpending.spendingSummaries &&
    advancedCalmSpending.largePurchaseCooldown &&
    advancedCalmSpending.purchaseSpacingCooldown &&
    advancedCalmSpending.noUrgencyCommerce &&
    advancedCalmSpending.noFakeScarcity &&
    advancedCalmSpending.preferencePersistence
  );
}
