import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type FeedItem = {
  rank?: number;
  id: string;
  title: string;
  source: string;
  topic?: string | null;
  score?: number;
  final_score?: number;
  media_url?: string | null;
  thumb_url?: string | null;
  media_type?: string | null;
  url?: string | null;
};

function readJsonSafe(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function normalize(items: unknown[]): FeedItem[] {
  return items
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object"),
    )
    .map((item, index) => ({
      rank: index + 1,
      id: String(item.id ?? `live-${index + 1}`),
      title: String(item.title ?? "Live"),
      source: String(item.source ?? "lumora"),
      topic:
        item.topic == null
          ? null
          : String(item.topic),
      score: Number(item.score ?? item.final_score ?? 0) || 0,
      final_score: Number(item.final_score ?? item.score ?? 0) || 0,
      media_url:
        item.media_url == null
          ? null
          : String(item.media_url),
      thumb_url:
        item.thumb_url == null
          ? null
          : String(item.thumb_url),
      media_type:
        item.media_type == null
          ? null
          : String(item.media_type),
      url:
        item.url == null
          ? null
          : String(item.url),
    }))
    .sort(
      (a, b) =>
        (b.final_score ?? 0) - (a.final_score ?? 0),
    )
    .slice(0, 20)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

function loadLatestFeedArtifact(): FeedItem[] {
  const dir = path.join(
    process.cwd(),
    "data",
    "live_feed",
  );

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs
    .readdirSync(dir)
    .filter((name) => /^feed_.*\.json$/i.test(name))
    .map((name) => {
      const full = path.join(dir, name);
      return {
        full,
        mtime: fs.statSync(full).mtimeMs,
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  for (const file of files) {
    const raw = readJsonSafe(file.full) as any;

    if (Array.isArray(raw)) {
      return normalize(raw);
    }

    if (Array.isArray(raw?.data?.feed)) {
      return normalize(raw.data.feed);
    }

    if (Array.isArray(raw?.feed)) {
      return normalize(raw.feed);
    }
  }

  return [];
}

export async function GET() {
  try {
    const feed = loadLatestFeedArtifact();

    return NextResponse.json(
      {
        ok: true,
        data: {
          feed,
        },
        degraded: feed.length === 0,
        source:
          feed.length > 0
            ? "live_feed_artifact"
            : "empty_safe_fallback",
        servedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "cache-control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : "unknown_error";

    return NextResponse.json(
      {
        ok: true,
        data: {
          feed: [],
        },
        degraded: true,
        source: "safe_error_fallback",
        error: "live_feed_degraded",
        detail,
        servedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "cache-control": "no-store, max-age=0",
        },
      },
    );
  }
}
