export function createCreatorPledge(input: { creatorId: string; cadence: string }) {
  return {
    ...input,
    active: true,
    createdAt: new Date().toISOString(),
  };
}
