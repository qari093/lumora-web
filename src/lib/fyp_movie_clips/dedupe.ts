export function buildMovieClipDedupeKey(input: { sourceId: string; sourceUrl?: string; title?: string; startSeconds?: number }) {
  return [
    input.sourceId,
    input.sourceUrl || "",
    input.title || "",
    Math.floor(Number(input.startSeconds || 0)),
  ].join("|").toLowerCase();
}

export function dedupeMovieCandidates<T extends { sourceId: string; sourceUrl?: string; title?: string; startSeconds?: number }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const item of items) {
    const key = buildMovieClipDedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}
