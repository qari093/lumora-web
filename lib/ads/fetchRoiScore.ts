export async function fetchRoiScore(input: {
  revenue: number;
  cost: number;
}) {
  try {
    const res = await fetch("/api/ads/roi", {
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
