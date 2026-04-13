export async function fetchConversionRate(input: {
  clicks: number;
  conversions: number;
}) {
  try {
    const res = await fetch("/api/ads/conversion-rate", {
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
