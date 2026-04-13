export async function fetchEloMatch(input: {
  requesterId: string;
  requesterElo: number;
  candidates: Array<{ creatorId: string; elo: number }>;
  maxGap?: number;
}) {
  try {
    const res = await fetch("/api/surge/matchmaking", {
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
