import fs from "node:fs";
import path from "node:path";

export type SeedTrack = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  durationSec: number;
  genres: string[];
  language: string;
  cover: string;
  playback: { kind: "seed"; url: string; mime: string };
};

type SeedFile = { version: number; generatedAt: string; items: SeedTrack[] };

let cache: SeedTrack[] | null = null;

function seedPath() {
  return path.join(process.cwd(), "data", "echo", "music.seed.json");
}

export function seedTracksEnabled() {
  const v = process.env.LUMORA_SEED_ECHO;
  if (v === undefined || v === null || v === "") return true;
  return v !== "0" && v.toLowerCase() !== "false" && v.toLowerCase() !== "off";
}

export function getSeedTracks(): SeedTrack[] {
  if (!seedTracksEnabled()) return [];
  if (cache) return cache;
  const p = seedPath();
  const raw = fs.readFileSync(p, "utf8");
  const json = JSON.parse(raw) as SeedFile;
  if (!json?.items || !Array.isArray(json.items)) return [];
  cache = json.items;
  return cache;
}
