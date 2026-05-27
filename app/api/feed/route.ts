import { NextResponse } from "next/server";
import { normalizeYouTubeItems } from "../../../src/lib/fyp/youtube/normalize";
import { buildMixedFeed, validateBuiltFeed } from "../../../src/lib/fyp/feed/engine";

export const dynamic = "force-dynamic";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

export async function GET() {
  try {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key || key === "PASTE_REAL_KEY_HERE") {
      return NextResponse.json({ ok: false, error: "Missing real YOUTUBE_API_KEY" }, { status: 500 });
    }

    const popular = await fetchJson(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,status&chart=mostPopular&maxResults=25&regionCode=US&key=${key}`
    );

    const trailerSearch = await fetchJson(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=official%20trailer&type=video&maxResults=15&key=${key}`
    );

    const trailerIds = (trailerSearch.items ?? [])
      .map((x: any) => x?.id?.videoId)
      .filter(Boolean)
      .join(",");

    let trailerDetails: any[] = [];
    if (trailerIds) {
      const details = await fetchJson(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails,status&id=${trailerIds}&key=${key}`
      );
      trailerDetails = details.items ?? [];
    }

    const merged = [...(popular.items ?? []), ...trailerDetails];
    const seen = new Set<string>();

    const embeddableItems = merged.filter((item: any) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);

      return (
        item?.status?.embeddable !== false &&
        item?.statistics?.viewCount &&
        Number(item.statistics.viewCount) > 0
      );
    });

    const normalized = normalizeYouTubeItems(embeddableItems, { type: "viral" });

    const feed = buildMixedFeed(normalized, {
      fallbackItems: normalized,
      minimumFeedLength: Math.min(20, Math.max(12, normalized.length)),
    });

    const validation = validateBuiltFeed(feed, Math.min(12, feed.length));

    return NextResponse.json(
      {
        ok: validation.ok,
        source: "youtube_real_fyp",
        count: feed.length,
        validation,
        items: feed,
      },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
