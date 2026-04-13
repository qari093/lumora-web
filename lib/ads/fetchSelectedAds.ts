export async function fetchSelectedAds(input: {
  ranked: { adId: string; performanceScore: number; portal?: string }[];
  maxSlots?: number;
}) {
  try {
    const res = await fetch("/api/ads/select", {
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
