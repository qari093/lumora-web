export async function fetchGeneratedAd(input: { portalKey: string }) {
  try {
    const res = await fetch("/api/ads/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return {
      status: res.status,
      data: await res.json(),
    };
  } catch {
    return null;
  }
}
