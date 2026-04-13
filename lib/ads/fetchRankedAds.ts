export async function fetchRankedAds(input: {
  ads: {
    adId: string;
    performanceScore: number;
    ctr?: number;
    engagementScore?: number;
  }[];
}) {
  try {
    const res = await fetch("/api/ads/rank", {
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
