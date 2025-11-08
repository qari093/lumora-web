import { NextResponse } from "next/server";

type PredictIn = {
  mood?: string | null;
  seed?: string | null;
  limit?: number | null;
  queued?: any[] | null;
};

function rand(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PredictIn;
    const mood = typeof body?.mood === "string" ? body.mood : "neutral";
    const limit = typeof body?.limit === "number" ? Math.max(1, Math.min(50, body.limit)) : 8;
    const seed = String(body?.seed || Date.now());
    const r = rand(seed + "|" + mood);

    const items = Array.from({ length: limit }).map((_, i) => {
      const score = Math.round((0.6 + r() * 0.4) * 100) / 100;
      const id = `pf_${seed}_${i}_${Math.floor(r() * 1e6)}`;
      const emotion = mood;
      const duration = 6 + Math.floor(r() * 24);
      return { id, emotion, score, duration, ts: Date.now() - Math.floor(r() * 600000) };
    });

    const queued = Array.isArray(body?.queued) ? body?.queued : [];
    const accepted = queued.length;

    return NextResponse.json({ ok: true, items, accepted, mood, seed });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}
