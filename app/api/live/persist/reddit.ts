export async function fetchReddit(): Promise<string | null> {
  try {
    const res = await fetch("https://www.reddit.com/r/popular.json?limit=25", {
      headers: {
        "User-Agent": "Mozilla/5.0 (LumoraRedditFix/1.0)",
        "Accept": "application/json"
      },
      cache: "no-store",
      redirect: "follow"
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (!text || text.length < 200) return null;

    const json = JSON.parse(text);
    if (!json?.data?.children?.length) return null;

    return JSON.stringify(json);
  } catch {
    return null;
  }
}
