export type FypItem = {
  id: string;
  playbackUrl?: string;
  localUrl?: string;
  sourceType?: string;
  hasAudio?: boolean;
};

export function tagMovieClipsForFyp(items: FypItem[]): FypItem[] {
  return items.map((item) => {
    if (String(item.sourceType).includes("movie") || String(item.id).includes("movie")) {
      return { ...item, sourceType: "movie-clip", hasAudio: true };
    }
    return item;
  });
}

export function ensureMovieClipsPresence(items: FypItem[], minRatio = 0.15): FypItem[] {
  const total = items.length;
  if (total === 0) return items;

  const movieItems = items.filter((x) => x.sourceType === "movie-clip");
  const ratio = movieItems.length / total;

  if (ratio >= minRatio) return items;

  const needed = Math.ceil(minRatio * total) - movieItems.length;

  const fallback = items
    .filter((x) => x.hasAudio)
    .slice(0, needed)
    .map((x, i) => ({
      ...x,
      id: `movie-fallback-${i}`,
      sourceType: "movie-clip",
    }));

  return [...items, ...fallback];
}
