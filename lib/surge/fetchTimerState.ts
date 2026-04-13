export async function fetchTimerState(input: {
  startAt: number;
  durationSeconds: number;
  now?: number;
}) {
  try {
    const res = await fetch("/api/surge/timer", {
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
