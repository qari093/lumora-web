export async function fetchFinalAdEligibility(input: {
  adId: string;
  spent: number;
  budget: number;
  fatigueScore: number;
  threshold: number;
  seenCount: number;
  maxPerSession: number;
}) {
  try {
    const res = await fetch("/api/ads/eligibility", {
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
