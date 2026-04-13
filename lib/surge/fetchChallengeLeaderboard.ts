import type { ChallengeLeaderboardEntry } from "./challengeLeaderboard";

export async function fetchChallengeLeaderboard(
  entries: ChallengeLeaderboardEntry[]
) {
  try {
    const res = await fetch("/api/surge/challenge/leaderboard", {
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
