export async function fetchTieredSelectedAds(input: {
  ads: {
    adId: string;
    performanceScore: number;
    tier?: "low" | "medium" | "high" | "elite";
    portal?: string;
  }[];
  maxSlots?: number;
}) {
  try {
    const res = await fetch("/api/ads/select-tiered", {
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
