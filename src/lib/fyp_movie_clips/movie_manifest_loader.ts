import fs from "node:fs";

const MANIFEST_PATH = "public/native-fyp/movie-meta/manifest.json";

export function loadMovieClipManifest(): any[] {
  if (!fs.existsSync(MANIFEST_PATH)) return [];

  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendToMovieClipManifest(items: any[]) {
  const existing = loadMovieClipManifest();
  const merged = [...existing, ...items];

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2));
  return merged.length;
}
