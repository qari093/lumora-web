export const zencoinCurrency = {
  zcEnabled: true,
  zenPulseEnabled: true,
  creatorLedgerDeferred: true,
  nonTransferable: true,
  cashoutEnabled: false,
  blockchainEnabled: false,
  utilityOnly: true
} as const;

export const zencoinBundles = [
  { eur: 5.99, zc: 500 },
  { eur: 11.99, zc: 1200 },
  { eur: 29.99, zc: 3500 }
] as const;

export function currencyFoundationHealthy(): boolean {
  return (
    zencoinCurrency.zcEnabled === true &&
    zencoinCurrency.zenPulseEnabled === true &&
    zencoinCurrency.creatorLedgerDeferred === true &&
    zencoinCurrency.nonTransferable === true &&
    zencoinCurrency.cashoutEnabled === false &&
    zencoinCurrency.blockchainEnabled === false &&
    zencoinCurrency.utilityOnly === true &&
    zencoinBundles.length === 3
  );
}
