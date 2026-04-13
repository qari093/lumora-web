import { injectCineVerseHooks, type CineVerseFeedItem } from "@/lib/feed/cineverse/engine";

export function applyTrailerHardOverride(): CineVerseFeedItem[] {
  const feed = injectCineVerseHooks();
  const trailer = feed.find((x) => x.type === "trailer");

  if (!trailer) return feed;

  const promoted = { ...trailer, score: 1.0 };
  const rest = feed.filter((x) => x.id !== trailer.id);

  return [promoted, ...rest.sort((a, b) => b.score - a.score)];
}
