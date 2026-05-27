import type { RealFeedSource } from "./types";

export const REAL_FEED_SOURCES: RealFeedSource[] = [
  "ugc_video",
  "gmar_event",
  "live_room",
  "music_clip",
  "movie_teaser",
  "creator_drop",
  "seed_content"
];

export function isRealFeedSource(
  source: string
): source is RealFeedSource {
  return REAL_FEED_SOURCES.includes(source as RealFeedSource);
}
