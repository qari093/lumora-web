export type ChallengeLeaderboardEntry = {
  creatorId: string;
  submissionId: string;
  score: number;
  likes: number;
  shares: number;
  completionRate: number;
};

export type RankedChallengeLeaderboardEntry = ChallengeLeaderboardEntry & {
  rank: number;
};

export function rankChallengeLeaderboard(
  entries: ChallengeLeaderboardEntry[]
): RankedChallengeLeaderboardEntry[] {
  const normalized = (entries || []).map((entry) => ({
    creatorId: entry.creatorId,
    submissionId: entry.submissionId,
    score: Number.isFinite(entry.score) ? entry.score : 0,
    likes: Math.max(0, entry.likes ?? 0),
    shares: Math.max(0, entry.shares ?? 0),
    completionRate: Math.max(0, Math.min(1, entry.completionRate ?? 0)),
    rank: 0,
  }));

  normalized.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.shares !== a.shares) return b.shares - a.shares;
    if (b.likes !== a.likes) return b.likes - a.likes;
    if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate;
    return a.creatorId.localeCompare(b.creatorId);
  });

  return normalized.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
