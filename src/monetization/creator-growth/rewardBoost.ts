export function calculateCreatorGrowthBoost(input: {
  zenScore: number;
  chaosEligible: boolean;
  recentImprovement: number;
}) {
  const base = input.zenScore >= 0.7 ? 1.1 : 1;
  const chaos = input.chaosEligible ? 0.15 : 0;
  const improvement = Math.min(0.2, Math.max(0, input.recentImprovement));

  return Number((base + chaos + improvement).toFixed(2));
}
