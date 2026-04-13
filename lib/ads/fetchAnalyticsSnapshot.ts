export async function fetchAnalyticsSnapshot(input: {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
}) {
  try {
    const res = await fetch("/api/ads/analytics-snapshot", {
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
