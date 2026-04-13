export async function fetchVoteAudit(input: {
  duelId: string;
  totalVotes: number;
  suspiciousVotes?: number;
  sampleRate?: number;
}) {
  try {
    const res = await fetch("/api/surge/duel/vote-audit", {
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
