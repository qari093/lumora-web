export async function createAdContent(input: {
  title: string;
  body: string;
  portal: string;
  route: string;
  cta: string;
}) {
  try {
    const res = await fetch("/api/ads/content", {
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
