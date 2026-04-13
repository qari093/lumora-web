import type { LumoraMode } from "@/lib/mode/mode";

type FeedItem = {
  id: string;
  kind: string;
  score?: number;
  [key: string]: any;
};

export function applyModeToFeed(feed: FeedItem[], mode: LumoraMode): FeedItem[] {
  if (!Array.isArray(feed)) return [];

  switch (mode) {
    case "focus":
      return feed.filter((x) => x.kind !== "ad" && x.kind !== "sponsored");

    case "chill":
      return feed.map((x) => ({
        ...x,
        score: (x.score || 0) * 0.8,
      }));

    case "surge":
      return feed.map((x) => ({
        ...x,
        score: (x.score || 0) * 1.2,
        surgeBoost: true,
      }));

    default:
      return feed;
  }
}
