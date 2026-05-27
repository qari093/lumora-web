export function buildCreatorStats(input: {
  creatorCount: number;
  payoutTotal: number;
  eligibleCreators: number;
}) {
  return {
    creatorCount: input.creatorCount,
    payoutTotal: input.payoutTotal,
    eligibleCreators: input.eligibleCreators,
    avgPayout:
      input.creatorCount > 0
        ? Number((input.payoutTotal / input.creatorCount).toFixed(2))
        : 0,
  };
}
