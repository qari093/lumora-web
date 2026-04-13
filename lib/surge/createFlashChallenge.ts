export async function createFlashChallengeRequest(input: {
  title: string;
  prompt: string;
  rewardPool: number;
  durationMinutes: number;
  startsAt?: number;
}) {
  try {
    const res = await fetch("/api/surge/challenge", {
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
