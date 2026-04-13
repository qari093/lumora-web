export async function checkDuelSpamRequest(input: {
  userId: string;
  lastVoteAt?: number;
  now?: number;
  minIntervalMs?: number;
}) {
  try {
    const res = await fetch("/api/surge/duel/anti-spam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return {
      status: res.status,
      data: await res.json(),
    };
  } catch {
    return null;
  }
}
