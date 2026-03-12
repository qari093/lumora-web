import { NextResponse } from "next/server";

type FeedItem = {
  id: string;
  title: string;
  slug: string;
  poster: string;
  videoUrl: string;
  source: "viral-video-fallback";
  portal: "videos";
  rank: number;
};

function syntheticSeed(): FeedItem[] {
  const now = Date.now();
  return [
    {
      id: `viral-seed-${now}-1`,
      title: "Lumora Viral Seed 1",
      slug: "lumora-viral-seed-1",
      poster: "/icon",
      videoUrl: "/video",
      source: "viral-video-fallback",
      portal: "videos",
      rank: 1,
    },
    {
      id: `viral-seed-${now}-2`,
      title: "Lumora Viral Seed 2",
      slug: "lumora-viral-seed-2",
      poster: "/icon",
      videoUrl: "/videos",
      source: "viral-video-fallback",
      portal: "videos",
      rank: 2,
    },
    {
      id: `viral-seed-${now}-3`,
      title: "Lumora Viral Seed 3",
      slug: "lumora-viral-seed-3",
      poster: "/icon",
      videoUrl: "/fyp",
      source: "viral-video-fallback",
      portal: "videos",
      rank: 3,
    },
  ];
}

async function readViralVideoFeed(req: Request): Promise<FeedItem[]> {
  try {
    const url = new URL("/api/videos/feed", req.url);
    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!res.ok) return [];

    const data = await res.json().catch(() => null);
    const items = Array.isArray(data?.items) ? data.items : [];

    return items
      .map((item: any, index: number) => ({
        id: String(item?.id || item?.slug || `viral-item-${index + 1}`),
        title: String(item?.title || item?.name || `Viral Video ${index + 1}`),
        slug: String(item?.slug || item?.id || `viral-item-${index + 1}`),
        poster: String(item?.poster || item?.thumbnail || "/icon"),
        videoUrl: String(item?.videoUrl || item?.url || "/videos"),
        source: "viral-video-fallback" as const,
        portal: "videos" as const,
        rank: index + 1,
      }))
      .filter((item: FeedItem) => !!item.id && !!item.title);
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const upstream = await readViralVideoFeed(req);
  const items = upstream.length > 0 ? upstream : syntheticSeed();

  return NextResponse.json({
    ok: true,
    marker: "fyp-feed",
    source: "viral-video-fallback",
    items,
    nextCursor: null,
    ts: new Date().toISOString(),
  });
}
