import fs from "node:fs";
import path from "node:path";

export type SeedMovie = {
  id: string;
  title: string;
  year: number;
  runtimeSec: number;
  rating: string;
  genres: string[];
  language: string;
  poster: string;
  synopsis: string;
  playback: { kind: "seed"; url: string; mime: string };
};

type SeedFile = { version: number; generatedAt: string; items: SeedMovie[] };

let cache: SeedMovie[] | null = null;

function seedPath() {
  // repo-root relative
  return path.join(process.cwd(), "data", "cineverse", "movies.seed.json");
}

export function seedMoviesEnabled() {
  // default ON for local/private beta unless explicitly disabled
  const v = process.env.LUMORA_SEED_CINEVERSE;
  if (v === undefined || v === null || v === "") return true;
  return v !== "0" && v.toLowerCase() !== "false" && v.toLowerCase() !== "off";
}

export function getSeedMovies(): SeedMovie[] {
  if (!seedMoviesEnabled()) return [];
  if (cache) return cache;
  const p = seedPath();
  const raw = fs.readFileSync(p, "utf8");
  const json = JSON.parse(raw) as SeedFile;
  if (!json?.items || !Array.isArray(json.items)) return [];
  cache = json.items;
  return cache;
}
