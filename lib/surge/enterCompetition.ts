export async function enterCompetition(input: {
  challengeId: string;
  userId: string;
  entryFee: number;
}) {
  try {
    const res = await fetch("/api/surge/competition/entry", {
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
