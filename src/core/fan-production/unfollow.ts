export function unfollowCreator(input: { userId: string; creatorId: string }) {
  return {
    ...input,
    following: false,
    unfollowedAt: new Date().toISOString(),
  };
}
