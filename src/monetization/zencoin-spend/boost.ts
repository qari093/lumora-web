export function createContentBoost(input: {
  userId: string;
  contentId: string;
  zenCost: number;
  durationHours: number;
}) {
  return {
    userId: input.userId,
    contentId: input.contentId,
    zenCost: input.zenCost,
    durationHours: input.durationHours,
    boostActive: input.zenCost >= 20 && input.durationHours > 0,
  };
}
