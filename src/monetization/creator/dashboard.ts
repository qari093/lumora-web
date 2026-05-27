export function buildCreatorMonetizationDashboard(input: {
  creatorId: string;
  estimatedPayout: number;
  zenEarned: number;
  zenScore: number;
  eligible: boolean;
}) {
  return {
    creatorId: input.creatorId,
    estimatedPayout: input.estimatedPayout,
    zenEarned: input.zenEarned,
    zenScore: input.zenScore,
    eligible: input.eligible,
    visibility: input.eligible ? "active" : "warming-up",
  };
}
