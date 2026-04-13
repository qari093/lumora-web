export async function fetchSessionRollup(input: {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  sessionMinutes: number;
}) {
  try {
    const res = await fetch("/api/ads/session-rollup", {
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
