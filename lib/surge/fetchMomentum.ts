export async function fetchMomentum(input: {
  leftVotes: number;
  rightVotes: number;
}) {
  try {
    const res = await fetch("/api/surge/duel/momentum", {
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
