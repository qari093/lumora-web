export async function fetchFlashChallengeState(input: {
  startsAt: number;
  endsAt: number;
  now?: number;
}) {
  try {
    const res = await fetch("/api/surge/challenge/state", {
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
