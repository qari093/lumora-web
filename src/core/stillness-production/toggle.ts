export function toggleSeasonOfStillness(input: { creatorId: string; enabled: boolean }) {
  return {
    creatorId: input.creatorId,
    stillnessEnabled: input.enabled,
    billingPaused: input.enabled,
    tqPaused: input.enabled,
    pledgesPaused: input.enabled,
    updatedAt: new Date().toISOString(),
  };
}
