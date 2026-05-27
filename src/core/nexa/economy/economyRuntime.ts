export const economyRuntime = {
  premiumRuntime: true,
  subscriptions: true,
  nexaEchoBundle: true,
  zencoinBridge: true,
  cosmeticsPremiumPrograms: true,
  calmSpendingRules: true,
  refundProtection: true,
  fraudProtection: true
} as const;

export function economyHealthy(): boolean {
  return Object.values(economyRuntime).every(Boolean);
}
