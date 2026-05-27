export type ForgeSeedPlan = {
  creatorId: string;
  contentId: string;
  targetUsers: number;
  affinityMatched: true;
  fairnessProtected: true;
};

export function createForgeSeedPlan(input: {
  creatorId: string;
  contentId: string;
  requestedUsers?: number;
}): ForgeSeedPlan {
  if (!input.creatorId.trim() || !input.contentId.trim()) {
    throw new Error("Forge seed plan requires creatorId and contentId.");
  }

  return {
    creatorId: input.creatorId,
    contentId: input.contentId,
    targetUsers: Math.min(input.requestedUsers ?? 5000, 5000),
    affinityMatched: true,
    fairnessProtected: true
  };
}
