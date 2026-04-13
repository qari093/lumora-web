export type RankedWinner = {
  creatorId: string;
  rank: number;
};

export type RewardPayout = RankedWinner & {
  payout: number;
};

export function distributeChallengeRewards(input: {
  rewardPool: number;
  winners: RankedWinner[];
}): RewardPayout[] {
  const rewardPool = Math.max(0, Math.floor(input.rewardPool || 0));
  const winners = Array.isArray(input.winners) ? input.winners : [];

  if (rewardPool === 0 || winners.length === 0) return [];

  const weights = [0.5, 0.3, 0.2];
  const top = winners
    .filter((w) => Number.isFinite(w.rank) && w.rank >= 1 && w.rank <= 3)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3);

  return top.map((winner) => ({
    creatorId: winner.creatorId,
    rank: winner.rank,
    payout: Math.floor(rewardPool * weights[winner.rank - 1]),
  }));
}
