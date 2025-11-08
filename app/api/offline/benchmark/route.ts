import { NextResponse } from "next/server";

type BenchIn = {
  ts?: number;
  results?: {
    latency_ms?: number | null;
    cache_entries?: number | null;
    compress_ratio?: number | null;
    queues?: Record<string, number>;
    user_agent?: string | null;
  };
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BenchIn;
    const r = body?.results || {};
    const latency = typeof r.latency_ms === "number" ? r.latency_ms : null;
    const cacheEntries = typeof r.cache_entries === "number" ? r.cache_entries : null;
    const ratio = typeof r.compress_ratio === "number" ? r.compress_ratio : null;
    const q = r.queues || {};
    const ua = typeof r.user_agent === "string" ? r.user_agent : null;

    let score = 100;
    if (latency != null) score -= Math.min(60, Math.max(0, (latency - 80) * 0.25));
    if (cacheEntries != null) score += Math.min(20, Math.log10(1 + cacheEntries) * 12);
    if (ratio != null) score += Math.min(10, Math.max(0, (1 - ratio) * 25));
    const penalty = Object.values(q).reduce((a, b) => a + (b > 0 ? 1 : 0), 0);
    score -= Math.min(20, penalty * 2);
    score = Math.max(1, Math.min(100, Math.round(score)));

    return NextResponse.json({
      ok: true,
      received_at: Date.now(),
      echo_ts: body?.ts || null,
      score,
      advice:
        score >= 85 ? "Great offline health" :
        score >= 70 ? "Good, minor tweaks possible" :
        score >= 55 ? "Fair, consider pruning and syncing" :
        "Weak, check connectivity and caches",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 });
  }
}
