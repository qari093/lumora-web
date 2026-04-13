import type { LeaderboardEntry } from "./duelLeaderboard";

export async function fetchLeaderboard(entries: LeaderboardEntry[]) {
  try {
    const res = await fetch("/api/surge/leaderboard", {
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
