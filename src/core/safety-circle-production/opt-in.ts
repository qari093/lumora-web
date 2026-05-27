export function optIntoSafetyCircle(input: { creatorId: string; contributionBps: number }) {
  return {
    creatorId: input.creatorId,
    contributionBps: Math.max(0, Math.min(1000, input.contributionBps)),
    active: true,
    joinedAt: new Date().toISOString(),
  };
}
