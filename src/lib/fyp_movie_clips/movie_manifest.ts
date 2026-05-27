export type MovieClipManifestItem = {
  id: string;
  title: string;
  source: "movie-clip";
  sourceId: string;
  sourceUrl: string;
  license: string;
  licenseProof: {
    sourceId: string;
    sourceUrl: string;
    license: string;
    checkedAt: string;
    safe: boolean;
  };
  localUrl: string;
  duration: number;
  hasAudio: true;
  audioCodec: string;
  mood: string;
  category: string;
  createdAt: string;
};

export function buildMovieClipManifestItem(input: Omit<MovieClipManifestItem, "source" | "createdAt">): MovieClipManifestItem {
  return {
    ...input,
    source: "movie-clip",
    createdAt: new Date().toISOString(),
  };
}

export function mergeMovieClipManifest(existing: MovieClipManifestItem[], incoming: MovieClipManifestItem[]) {
  const seen = new Set(existing.map((item) => `${item.sourceId}:${item.localUrl}`));
  const merged = [...existing];

  for (const item of incoming) {
    const key = `${item.sourceId}:${item.localUrl}`;
    if (seen.has(key)) continue;
    merged.push(item);
    seen.add(key);
  }

  return merged;
}
