export const creatorEconomy = {
  kycEnabled: true,
  stripeConnect: true,
  payoutLedger: true,
  moderationEnabled: true,
  creatorAnalytics: true,
  trustedCreatorTiers: true,
  amlHooks: true
};

export function creatorEconomyHealthy(): boolean {
  return (
    creatorEconomy.kycEnabled &&
    creatorEconomy.stripeConnect &&
    creatorEconomy.payoutLedger &&
    creatorEconomy.moderationEnabled
  );
}
