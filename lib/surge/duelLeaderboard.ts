export type LeaderboardEntry = {
  creatorId: string;
  wins: number;
  losses: number;
  ties: number;
  elo: number;
};

export type RankedLeaderboardEntry = LeaderboardEntry & {
  points: number;
  rank: number;
};

export function rankLeaderboard(
  entries: LeaderboardEntry[]
): RankedLeaderboardEntry[] {
  const normalized = (entries || []).map((entry) => {
    const wins = Math.max(0, entry.wins ?? 0);
    const losses = Math.max(0, entry.losses ?? 0);
    const ties = Math.max(0, entry.ties ?? 0);
    const elo = Math.max(0, entry.elo ?? 0);

    const points = wins * 3 + ties;

    return {
      creatorId: entry.creatorId,
      wins,
      losses,
      ties,
      elo,
      points,
      rank: 0,
    };
  });

  normalized.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.elo !== a.elo) return b.elo - a.elo;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.creatorId.localeCompare(b.creatorId);
  });

  return normalized.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
