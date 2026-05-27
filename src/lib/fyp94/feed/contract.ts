import type { Fyp94FeedItem, Fyp94FeedResponse } from "./types";

export function buildFyp94FeedResponse(items: Fyp94FeedItem[]): Fyp94FeedResponse {
  return {
    ok: true,
    source: "fyp94",
    version: "9.4",
    items,
    generatedAt: new Date().toISOString(),
  };
}

export function validateFyp94FeedContract(response: Fyp94FeedResponse): boolean {
  return (
    response.ok === true &&
    response.source === "fyp94" &&
    response.version === "9.4" &&
    Array.isArray(response.items) &&
    response.items.length > 0 &&
    response.items.every((item) => Boolean(item.id && item.playbackUrl && item.posterUrl))
  );
}
