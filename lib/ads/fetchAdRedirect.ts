export async function fetchAdRedirect(input: {
  type: string;
  value: string;
}) {
  try {
    const url = `/api/ads/redirect?type=${encodeURIComponent(input.type)}&value=${encodeURIComponent(input.value)}`;
    const res = await fetch(url, { method: "GET" });

    return {
      status: res.status,
      data: await res.json(),
    };
  } catch {
    return null;
  }
}
