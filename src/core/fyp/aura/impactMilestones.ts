export type ImpactMilestone = {
  milestoneId: string;
  creatorId: string;
  label: string;
  unlocked: boolean;
};

export function createImpactMilestones(input: {
  creatorId: string;
  impactQuotient: number;
}): ImpactMilestone[] {
  return [
    {
      milestoneId: "impact_100",
      creatorId: input.creatorId,
      label: "First Shock",
      unlocked: input.impactQuotient >= 100
    },
    {
      milestoneId: "impact_500",
      creatorId: input.creatorId,
      label: "Culture Spike",
      unlocked: input.impactQuotient >= 500
    },
    {
      milestoneId: "impact_1000",
      creatorId: input.creatorId,
      label: "Myth Signal",
      unlocked: input.impactQuotient >= 1000
    }
  ];
}
