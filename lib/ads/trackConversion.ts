export async function trackConversion(input: {
  adId: string;
  portal: string;
  action: string;
  value?: number;
}) {
  try {
    const res = await fetch("/api/ads/conversion", {
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
