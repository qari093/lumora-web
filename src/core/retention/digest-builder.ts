export function buildWeeklyDigest(input: { userId: string; itemCount: number }) {
  return {
    userId: input.userId,
    itemCount: input.itemCount,
    ready: true,
  };
}
