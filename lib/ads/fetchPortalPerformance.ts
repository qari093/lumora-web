export async function fetchPortalPerformance(input: {
  ctr: number;
  engagementScore: number;
  conversions?: number;
}) {
  try {
    const res = await fetch("/api/ads/performance", {
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
