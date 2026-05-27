export function trackRevenue(input: {
  adRevenue: number;
  zenSpendRevenue: number;
  creatorCost: number;
}) {
  const gross = input.adRevenue + input.zenSpendRevenue;
  const net = gross - input.creatorCost;

  return {
    gross: Number(gross.toFixed(2)),
    net: Number(net.toFixed(2)),
    creatorCost: input.creatorCost,
  };
}
