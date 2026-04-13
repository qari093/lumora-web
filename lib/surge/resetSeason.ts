import type { LeaderboardEntry } from "./duelLeaderboard";

export async function resetSeasonRequest(entries: LeaderboardEntry[]) {
  try {
    const res = await fetch("/api/surge/leaderboard/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
