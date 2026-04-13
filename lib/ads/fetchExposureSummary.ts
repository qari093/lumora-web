export async function fetchExposureSummary(input: {
  impressions: number;
  clicks: number;
  conversions: number;
  uniqueAdsSeen: number;
}) {
  try {
    const res = await fetch("/api/ads/exposure-summary", {
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
