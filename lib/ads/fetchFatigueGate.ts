export async function fetchFatigueGate(input: {
  adId: string;
  fatigueScore: number;
  threshold?: number;
}) {
  try {
    const res = await fetch("/api/ads/fatigue-gate", {
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
