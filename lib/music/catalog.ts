export type TrackItem = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  lang: string;
  genre: string;
  durationSec: number;
  coverEmoji: string;
};

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export function buildSeedTracks(count = 200): TrackItem[] {
  const base: Omit<TrackItem, "id" | "title">[] = [
    { artist: "Lumora Echo", album: "Neon Calm", year: 2022, lang: "EN", genre: "Ambient", durationSec: 184, coverEmoji: "🌙" },
    { artist: "ZenPulse", album: "City Glass", year: 2021, lang: "EN", genre: "Lo-fi", durationSec: 162, coverEmoji: "🫧" },
    { artist: "NEXA Drift", album: "Breathworks", year: 2023, lang: "EN", genre: "Wellness", durationSec: 206, coverEmoji: "🌿" },
    { artist: "Punjab Spark", album: "Golden Dhol", year: 2020, lang: "PA", genre: "Bhangra", durationSec: 198, coverEmoji: "🥁" },
    { artist: "Bol City", album: "Night Bazaar", year: 2019, lang: "HI", genre: "Pop", durationSec: 172, coverEmoji: "✨" },
    { artist: "Aurora Loop", album: "Blue Blade", year: 2024, lang: "EN", genre: "Synthwave", durationSec: 214, coverEmoji: "🔷" },
    { artist: "Desi Strings", album: "Monsoon", year: 2018, lang: "HI", genre: "Acoustic", durationSec: 188, coverEmoji: "🎻" },
    { artist: "Echo Lantern", album: "Soft Gravity", year: 2024, lang: "EN", genre: "Chill", durationSec: 176, coverEmoji: "🏮" },
  ];

  const out: TrackItem[] = [];
  for (let i = 1; i <= count; i++) {
    const b = base[(i - 1) % base.length];
    const id = `tr_${pad3(i)}`;
    const title = `Lumora Track ${pad3(i)}`;
    out.push({ id, title, ...b });
  }
  return out;
}

export const SEED_TRACKS = buildSeedTracks(200);

export function getTrackById(id: string): TrackItem | null {
  return SEED_TRACKS.find((t) => t.id === id) || null;
}
