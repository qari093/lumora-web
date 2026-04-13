export async function fetchAdEvents(input: {
  impressions?: number;
  clicks?: number;
}) {
  try {
    const res = await fetch("/api/ads/events", {
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
