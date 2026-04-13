export async function fetchCtrMetrics(input: {
  impressions: number;
  clicks: number;
}) {
  try {
    const res = await fetch("/api/ads/ctr", {
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
