export const creatorEconomy = {
  storefronts: true,
  affiliateSystem: true,
  escrowRuntime: true,
  liveCommerce: true,
  creatorAnalytics: true
} as const;

export function creatorEconomyHealthy(): boolean {
  return (
    creatorEconomy.storefronts &&
    creatorEconomy.affiliateSystem &&
    creatorEconomy.escrowRuntime &&
    creatorEconomy.liveCommerce &&
    creatorEconomy.creatorAnalytics
  );
}
