export async function trackClick(input: {
  type: string;
  value: string;
}) {
  try {
    const url = `/api/ads/click?type=${encodeURIComponent(input.type)}&value=${encodeURIComponent(input.value)}`;
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
