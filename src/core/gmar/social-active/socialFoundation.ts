export function createGmarLeaderboardEntry(input: any = {}) {
  const state = input.state ?? {};
  return {
    playerId: state.player?.playerId ?? "gmar_user_001",
    displayName: state.player?.displayName ?? "Waqar",
    score: Number(input.score ?? 100),
    rank: Number(input.rank ?? 1)
  };
}

export function assertGmarLeaderboardEntry(entry: any): boolean {
  return Boolean(entry?.playerId === "gmar_user_001" && entry.rank === 1);
}

