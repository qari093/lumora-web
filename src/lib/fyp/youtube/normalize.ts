import { asNumber, safeString, type LumoraContentItem, type LumoraContentType } from "../schema";

function parseDurationSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = Number(match[1] ?? 0);
  const m = Number(match[2] ?? 0);
  const s = Number(match[3] ?? 0);
  return h * 3600 + m * 60 + s;
}

export function normalizeYouTubeItems(
  rawItems: Array<Record<string, any>>,
  options: {
    type?: LumoraContentType;
    verifiedChannelIds?: string[];
  } = {},
): LumoraContentItem[] {
  const verified = new Set(options.verifiedChannelIds ?? []);

  return rawItems
    .map((raw): LumoraContentItem | null => {
      const id = safeString(raw.id?.videoId ?? raw.id);
      if (!id) return null;

      const snippet = raw.snippet ?? {};
      const stats = raw.statistics ?? {};
      const details = raw.contentDetails ?? {};

      const title = safeString(snippet.title, "Untitled");
      const description = safeString(snippet.description);
      const channelId = safeString(snippet.channelId);
      const channelTitle = safeString(snippet.channelTitle);
      const publishedAt = safeString(snippet.publishedAt, new Date().toISOString());
      const thumbnailUrl =
        safeString(snippet.thumbnails?.maxres?.url) ||
        safeString(snippet.thumbnails?.high?.url) ||
        safeString(snippet.thumbnails?.medium?.url) ||
        safeString(snippet.thumbnails?.default?.url);

      const views = asNumber(stats.viewCount);
      const likes = asNumber(stats.likeCount);
      const comments = asNumber(stats.commentCount);
      const ageHours = Math.max(1, (Date.now() - new Date(publishedAt).getTime()) / 36e5);
      const velocity = views / ageHours;

      const text = `${title} ${description}`.toLowerCase();
      const looksTrailer = text.includes("trailer") || text.includes("teaser");

      return {
        id,
        sourceId: id,
        platform: "youtube",
        type: options.type ?? (looksTrailer ? "trailer" : "viral"),
        title,
        description,
        thumbnailUrl,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
        durationSeconds: parseDurationSeconds(safeString(details.duration)),
        publishedAt,
        tags: Array.isArray(snippet.tags) ? snippet.tags.filter((x: unknown) => typeof x === "string") : [],
        source: {
          channelId,
          channelTitle,
          isVerifiedSource: verified.has(channelId),
          trustScore: verified.has(channelId) ? 0.95 : 0.65,
        },
        stats: { views, likes, comments, velocity },
      };
    })
    .filter((x): x is LumoraContentItem => Boolean(x));
}
