export const marketplaceRuntime = {
  giftingEnabled: true,
  marketplaceEnabled: true,
  sellerModeration: true,
  fraudProtection: true,
  digitalGoodsEngine: true,
  recommendationEngine: true
};

export function marketplaceHealthy(): boolean {
  return (
    marketplaceRuntime.giftingEnabled &&
    marketplaceRuntime.marketplaceEnabled &&
    marketplaceRuntime.fraudProtection
  );
}
