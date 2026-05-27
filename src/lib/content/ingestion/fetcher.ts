export async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { timeout: 10000 });
    if (!res.ok) throw new Error("fetch failed");
    return await res.json();
  } catch {
    return null;
  }
}
