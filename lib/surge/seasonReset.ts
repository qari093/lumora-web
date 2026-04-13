import type { LeaderboardEntry } from "./duelLeaderboard";

export type SeasonResetResult = {
  seasonId: string;
  resetAt: number;
  archivedCount: number;
  nextLeaderboard: LeaderboardEntry[];
};

export function resetSeason(entries: LeaderboardEntry[]): SeasonResetResult {
  const resetAt = Date.now();
  const seasonId = `season_${new Date(resetAt).toISOString().slice(0, 10)}`;

  const nextLeaderboard = (entries || []).map((entry) => ({
    creatorId: entry.creatorId,
    wins: 0,
    losses: 0,
    ties: 0,
    elo: entry.elo,
  }));

  return {
    seasonId,
    resetAt,
    archivedCount: Array.isArray(entries) ? entries.length : 0,
    nextLeaderboard,
  };
}
