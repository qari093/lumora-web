export async function fetchGoogleTrends(): Promise<string | null> {
  const urls = [
    "https://trends.google.com/trending/rss?geo=US",
    "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (LumoraGoogleFix/1.0)",
          "Accept": "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.1"
        },
        cache: "no-store",
        redirect: "follow"
      });

      if (!res.ok) continue;

      const text = await res.text();
      if (text && text.length > 200 && /<rss|<item|<channel/i.test(text)) {
        return text;
      }
    } catch {
      continue;
    }
  }

  return null;
}
