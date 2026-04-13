export async function fetchBudgetedSelectedAds(input: {
  ads: {
    adId: string;
    performanceScore: number;
    portal?: string;
    spent?: number;
    budget?: number;
  }[];
  maxSlots?: number;
}) {
  try {
    const res = await fetch("/api/ads/select-budgeted", {
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
