export function calculateCreatorPayout(input: {
  revenuePool: number;
  creatorWeight: number;
  totalWeight: number;
}) {
  if (input.revenuePool <= 0 || input.creatorWeight <= 0 || input.totalWeight <= 0) {
    return 0;
  }

  return Number(((input.creatorWeight / input.totalWeight) * input.revenuePool).toFixed(2));
}
