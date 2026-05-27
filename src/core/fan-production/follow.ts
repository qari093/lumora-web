export function followCreator(input: { userId: string; creatorId: string }) {
  return {
    ...input,
    following: true,
    followedAt: new Date().toISOString(),
  };
}
