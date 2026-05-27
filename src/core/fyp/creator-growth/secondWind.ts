export type SecondWindBoost = {
  creatorId: string;
  eligible: boolean;
  boostPercent: number;
  reason: string;
};

export function calculateSecondWindBoost(input: {
  creatorId: string;
  daysSinceJoin: number;
  recentImpactDrop: boolean;
  consistentPosting: boolean;
}): SecondWindBoost {
  if (!input.creatorId.trim()) {
    throw new Error("Second Wind requires creatorId.");
  }

  const eligible =
    input.daysSinceJoin <= 30 &&
    input.recentImpactDrop &&
    input.consistentPosting;

  return {
    creatorId: input.creatorId,
    eligible,
    boostPercent: eligible ? 20 : 0,
    reason: eligible ? "early_creator_recovery" : "not_eligible"
  };
}
