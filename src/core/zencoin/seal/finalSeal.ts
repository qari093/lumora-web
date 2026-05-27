export const zencoinFinalSeal = {
  walletSystemsEnabled: true,
  zcPurchasesEnabled: true,
  subscriptionsEnabled: true,
  atmospherePurchasesEnabled: true,
  financialWeatherEnabled: true,
  lumoraShieldEnabled: true,
  observabilityEnabled: true,
  privacyToolsEnabled: true,
  productionSealed: true
} as const;

export function zencoinLaunchComplete(): boolean {
  return Object.values(zencoinFinalSeal).every(Boolean);
}
