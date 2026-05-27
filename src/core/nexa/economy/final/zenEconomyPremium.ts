export const zenEconomyPremium = {
  premiumRuntime: true,
  subscriptionValidation: true,
  nexaEchoBundle: true,
  zencoinBridge: true,
  cosmeticsPremiumPrograms: true,
  creatorPackRuntime: true,
  calmSpendingRules: true,
  refundProtection: true,
  fraudProtection: true,
  noEssentialHealthPaywall: true
} as const;

export function zenEconomyPremiumHealthy(): boolean {
  return Object.values(zenEconomyPremium).every(Boolean);
}
