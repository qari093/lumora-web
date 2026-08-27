export async function fetchNASA() {
  try {
    const res = await fetch("https://images-api.nasa.gov/search?media_type=video", { signal: AbortSignal.timeout(10000) });
    const json: any = await res.json();

    return (json.collection?.items || []).slice(0,10).map((i: any) => ({
      id: i.data?.[0]?.nasa_id,
      title: i.data?.[0]?.title,
      source: "NASA",
      license: "public domain",
      hasAudio: true,
      playableUrl: i.links?.[0]?.href || ""
    }));
  } catch {
    return [];
  }
}
