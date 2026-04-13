export async function trackImpression(input: {
  adId: string;
  portal: string;
  slotIndex?: number;
}) {
  try {
    const res = await fetch("/api/ads/impression", {
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
