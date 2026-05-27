export type CreatorGrowthMilestone = {
  milestoneId: string;
  label: string;
  unlocked: boolean;
};

export function createCreatorGrowthMilestones(input: {
  impactQuotient: number;
  followers: number;
  echoCount: number;
}): CreatorGrowthMilestone[] {
  return [
    {
      milestoneId: "first_signal",
      label: "First Signal",
      unlocked: input.impactQuotient >= 50
    },
    {
      milestoneId: "first_crowd",
      label: "First Crowd",
      unlocked: input.followers >= 100
    },
    {
      milestoneId: "echo_wave",
      label: "Echo Wave",
      unlocked: input.echoCount >= 250
    }
  ];
}
