export async function fetchFypAdAudit(input: {
  totalFeedItems: number;
  sponsoredItems: number;
  injectedAds: number;
  eligibleAds: number;
}) {
  try {
    const res = await fetch("/api/ads/fyp-audit", {
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
