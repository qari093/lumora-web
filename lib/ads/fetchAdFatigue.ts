export async function fetchAdFatigue(input: {
  impressions: number;
  uniqueAdsSeen: number;
  clicks: number;
}) {
  try {
    const res = await fetch("/api/ads/fatigue", {
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
