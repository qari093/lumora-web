export async function fetchFatigueSafeAds(input: {
  ads: {
    adId: string;
    performanceScore: number;
    portal?: string;
    fatigueScore?: number;
    threshold?: number;
  }[];
  maxSlots?: number;
}) {
  try {
    const res = await fetch("/api/ads/select-fatigue-safe", {
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
