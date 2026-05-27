import { NextResponse } from "next/server";

type FeedItem = {
  id: string;
  title: string;
  slug: string;
  creator: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl?: string;
};

function liveFeed(): FeedItem[] {
  return [
    {
      id: "feed-1",
      title: "Lumora Welcome Drop",
      slug: "lumora-welcome-drop",
      creator: "Lumora",
      category: "Launch",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    {
      id: "feed-2",
      title: "GMAR Highlight Seed",
      slug: "gmar-highlight-seed",
      creator: "GMAR",
      category: "Games",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: "feed-3",
      title: "CineVerse Discovery Seed",
      slug: "cineverse-discovery-seed",
      creator: "CineVerse",
      category: "Movies",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
    },
  ];
}

export async function GET() {
  const items = liveFeed();

  return NextResponse.json(
    {
      ok: true,
      source: "fallback",
      items,
      ts: new Date().toISOString(),
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    }
  );
}
