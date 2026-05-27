export type MonetizationPulseMetrics = {
  revenuePerSession: number;
  adEngagementRate: number;
  zenVelocity: number;
  creatorPayoutTotal: number;
  protectedStateShare: number;
};

export function createMonetizationPulseMetrics(input: MonetizationPulseMetrics) {
  return {
    ...input,
    healthy:
      input.revenuePerSession >= 0 &&
      input.adEngagementRate >= 0 &&
      input.zenVelocity >= 0 &&
      input.creatorPayoutTotal >= 0 &&
      input.protectedStateShare <= 0.4,
  };
}
