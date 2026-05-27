export function applyCreatorTrustMultiplier(input: {
  basePayout: number;
  zenScore: number;
}) {
  const multiplier = input.zenScore >= 0.8 ? 1.15 : input.zenScore >= 0.5 ? 1.05 : 1;

  return {
    multiplier,
    payout: Number((input.basePayout * multiplier).toFixed(2)),
  };
}
