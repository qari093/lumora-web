import type { RankedWinner } from "./challengeRewards";

export async function fetchChallengeRewards(input: {
  rewardPool: number;
  winners: RankedWinner[];
}) {
  try {
    const res = await fetch("/api/surge/challenge/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
