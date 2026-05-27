import fs from "node:fs";

const MANIFEST_PATH = "public/native-fyp/movie-meta/manifest.json";

export type LiveMovieClipRecord = {
  id: string;
  title?: string;
  localUrl: string;
  sourceType: "movie-clip";
  sourceId?: string;
  sourceUrl?: string;
  license?: string;
  hasAudio: true;
  duration?: number;
  mood?: string;
  category?: string;
};

export function readLiveMovieManifest(): LiveMovieClipRecord[] {
  if (!fs.existsSync(MANIFEST_PATH)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLiveMovieManifest(items: LiveMovieClipRecord[]): LiveMovieClipRecord[] {
  const existing = readLiveMovieManifest();
  const seen = new Set(existing.map((x) => x.localUrl));
  const merged = [...existing];

  for (const item of items) {
    if (!item.localUrl || seen.has(item.localUrl)) continue;

    merged.push({
      ...item,
      sourceType: "movie-clip",
      hasAudio: true,
    });

    seen.add(item.localUrl);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2));
  return merged;
}

export function getPlayableLiveMovieClips(): LiveMovieClipRecord[] {
  return readLiveMovieManifest().filter((x) => {
    if (!x.localUrl || !x.hasAudio) return false;
    return fs.existsSync(`public${x.localUrl}`);
  });
}
