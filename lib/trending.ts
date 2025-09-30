import fs from "node:fs/promises";
import path from "node:path";
import { readManifest, Track } from "./library";

type TrendingItem = {
  rank: number;
  score: number;
  id: string;
  title: string;
  artist?: string;
  url: string;
  genre?: string;
  source?: string;
  createdAt?: number;
  bpm?: number;
  /** added fields */
  isNew?: boolean;
  delta?: number;       // score delta vs previous snapshot
  rankDelta?: number;   // rank improvement vs previous snapshot (negative = worse, positive = climbed)
};

type TrendingPayload = { generatedAt: number; window: "hourly"; items: TrendingItem[] };

async function readPrevTrending(filePath: string): Promise<TrendingPayload | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Score recent tracks higher; weight uploads & feeds; normalize to [0,100] */
export async function computeTrendingHourly() {
  const m = await readManifest();
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const RECENT_WINDOW = 6 * HOUR; // consider last 6h; decay favors last 60m

  const recent: Track[] = (m.catalog || []).filter((t) => {
    const ts = t.createdAt ?? 0;
    return now - ts <= RECENT_WINDOW;
  });

  // score
  const scored = recent.map((t) => {
    const ts = t.createdAt ?? (m.lastUpdated || now);
    const ageMs = Math.max(1, now - ts);
    const decay = Math.exp(-ageMs / (1 * HOUR)); // 1-hour decay feel
    const sw =
      t.source === "upload"
        ? 1.3
        : /feed|trend/i.test(String(t.source))
        ? 1.15
        : 1.0;
    const bpm = Number(t.bpm || 0);
    const tempoBonus = bpm >= 118 && bpm <= 142 ? 1.1 : 1.0;
    const genreBonus = ["lofi", "focus", "house", "techno", "hiphop", "pop"].includes(String(t.genre || ""))
      ? 1.05
      : 1.0;
    const score = 100 * decay * sw * tempoBonus * genreBonus;
    return { ...t, _score: score };
  });

  scored.sort((a, b) => (b._score || 0) - (a._score || 0));
  const max = scored[0]?.["_score"] || 1;

  const outPath = path.join(process.cwd(), "public/music/trending-hourly.json");
  const prev = await readPrevTrending(outPath);
  const prevById = new Map<string, { score: number; rank: number }>();
  if (prev?.items?.length) {
    prev.items.forEach((it) => prevById.set(it.id, { score: it.score, rank: it.rank }));
  }

  const list: TrendingItem[] = scored.slice(0, 100).map((t, i) => {
    const norm = Math.round(((t._score || 0) / max) * 100);
    const prevEntry = prevById.get(t.id);
    const delta = prevEntry ? norm - prevEntry.score : undefined;
    const rankDelta = prevEntry ? prevEntry.rank - (i + 1) : undefined; // positive = climbed
    const isNew = !prevEntry;
    return {
      rank: i + 1,
      score: norm,
      id: t.id,
      title: t.title,
      artist: t.artist,
      url: t.url,
      genre: t.genre,
      source: t.source,
      createdAt: t.createdAt,
      bpm: t.bpm,
      isNew,
      delta,
      rankDelta,
    };
  });

  const payload: TrendingPayload = { generatedAt: now, window: "hourly", items: list };
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(payload, null, 2));
  return payload;
}
