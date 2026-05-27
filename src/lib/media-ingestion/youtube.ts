import fs from "fs";
import path from "path";

export type YoutubeItem = {
  id: string;
  source: "youtube";
  title: string;
  url: string;
  media_url: string;
  thumb_url: string;
  media_type: "youtube";
  score_hint: number;
  final_score: number;
  ts: number;
  topic: string;
  channel_title: string;
  published_at: string;
};

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function feedUrls(): string[] {
  return (process.env.LUMORA_YOUTUBE_FEED_URLS || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function firstMatch(s: string, re: RegExp): string {
  const m = s.match(re);
  return m ? m[1].trim() : "";
}

function attrValue(tag: string, attr: string): string {
  const m = tag.match(new RegExp(`${attr}="([^"]+)"`, "i"));
  return m ? m[1] : "";
}

function normalizeTopic(title: string): string {
  const t = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return t || "youtube";
}

function parseFeed(xml: string): YoutubeItem[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];
  const out: YoutubeItem[] = [];

  for (const entry of entries) {
    const videoId =
      firstMatch(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/i) ||
      firstMatch(entry, /<videoId>([^<]+)<\/videoId>/i);

    const title = firstMatch(entry, /<title>([\s\S]*?)<\/title>/i).replace(/\s+/g, " ");
    const published = firstMatch(entry, /<published>([^<]+)<\/published>/i);
    const updated = firstMatch(entry, /<updated>([^<]+)<\/updated>/i);
    const author = firstMatch(entry, /<name>([\s\S]*?)<\/name>/i).replace(/\s+/g, " ");

    const linkTag = (entry.match(/<link[^>]+rel="alternate"[^>]*>/i) || [""])[0];
    const thumbTag = (entry.match(/<media:thumbnail[^>]+>/i) || [""])[0];

    if (!videoId || !title) continue;

    const url = attrValue(linkTag, "href") || `https://www.youtube.com/watch?v=${videoId}`;
    const thumbUrl =
      attrValue(thumbTag, "url") || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const ts = Date.parse(published || updated || "") || Date.now();

    out.push({
      id: `youtube:${videoId}`,
      source: "youtube",
      title,
      url,
      media_url: `https://www.youtube.com/embed/${videoId}`,
      thumb_url: thumbUrl,
      media_type: "youtube",
      score_hint: 1000,
      final_score: 1000,
      ts,
      topic: normalizeTopic(title),
      channel_title: author || "YouTube",
      published_at: published || updated || new Date(ts).toISOString(),
    });
  }

  return out;
}

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Lumora/1.0",
      "accept": "application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`youtube_fetch_failed:${res.status}`);
  }

  return await res.text();
}

export async function ingestYoutubeFeeds(): Promise<YoutubeItem[]> {
  const urls = feedUrls();
  if (!urls.length) {
    throw new Error("youtube_feed_urls_missing");
  }

  const rawDir = path.join(process.cwd(), "data", "live_ingestion_raw", "youtube");
  const sigDir = path.join(process.cwd(), "data", "live_signals", "youtube");
  ensureDir(rawDir);
  ensureDir(sigDir);

  let all: YoutubeItem[] = [];

  for (const url of urls) {
    const xml = await fetchXml(url);
    const stamp = Date.now();
    const rawFile = path.join(
      rawDir,
      `raw_${stamp}_${Buffer.from(url).toString("base64url").slice(0, 12)}.xml`
    );
    fs.writeFileSync(rawFile, xml, "utf-8");
    all = all.concat(parseFeed(xml));
  }

  const dedup = new Map<string, YoutubeItem>();
  for (const item of all) {
    const prev = dedup.get(item.id);
    if (!prev || item.ts > prev.ts) dedup.set(item.id, item);
  }

  const normalized = Array.from(dedup.values()).sort((a, b) => b.ts - a.ts);
  fs.writeFileSync(
    path.join(sigDir, "latest.json"),
    JSON.stringify(normalized, null, 2),
    "utf-8"
  );

  return normalized;
}
