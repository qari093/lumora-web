import fs from "node:fs/promises";
import path from "node:path";
import type { LumoraSignal } from "@/types/lumora.signal";
import { annotateGravityBatch } from "@/lib/intelligence/gravity";
import { annotateTrailerPriorityBatch } from "@/lib/intelligence/trailerPriority";
import { annotateSaturationBatch } from "@/lib/intelligence/saturation";
import { annotateDecayBatch } from "@/lib/intelligence/decay";
import { annotateCoherenceBatch } from "@/lib/intelligence/coherence";
import { annotateCultureBatch } from "@/lib/intelligence/culture";
import { annotateEmotionsBatch } from "@/lib/intelligence/emotions";
import { applySignalWeights } from "@/lib/intelligence/weights";

export type PrecomputedRankedSignal = LumoraSignal & {
  gravityScore: number;
  gravityBand: string;
  trailerPriorityScore: number;
  trailerPriorityBand: string;
  derivedSaturationIndex: number;
  saturationBand: string;
  decayRiskScore: number;
  decayState: string;
  coherenceScore: number;
  culturalTags: string[];
  derivedEmotionTags: string[];
  platformWeight: number;
  weightedScore: number;
  finalRankScore: number;
};

export type RankingSnapshot = {
  ok: boolean;
  count: number;
  updatedAt: number;
  signals: PrecomputedRankedSignal[];
};

const OUT_DIR = path.join(process.cwd(), "data", "intelligence");
const OUT_FILE = path.join(OUT_DIR, "ranking.precompute.json");

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map((items || []).map((item) => [item.id, item]));
}

export function precomputeRanking(signals: LumoraSignal[]): PrecomputedRankedSignal[] {
  const weighted = indexById(applySignalWeights(signals));
  const gravity = indexById(annotateGravityBatch(signals));
  const trailer = indexById(annotateTrailerPriorityBatch(signals));
  const saturation = indexById(annotateSaturationBatch(signals));
  const decay = indexById(annotateDecayBatch(signals));
  const coherence = indexById(annotateCoherenceBatch(signals));
  const culture = indexById(annotateCultureBatch(signals));
  const emotions = indexById(annotateEmotionsBatch(signals));

  const ranked: PrecomputedRankedSignal[] = (signals || []).map((signal) => {
    const w = weighted.get(signal.id);
    const g = gravity.get(signal.id);
    const t = trailer.get(signal.id);
    const s = saturation.get(signal.id);
    const d = decay.get(signal.id);
    const c = coherence.get(signal.id);
    const cu = culture.get(signal.id);
    const e = emotions.get(signal.id);

    const finalRankScore =
      (g?.gravityScore || 0) * 0.34 +
      (w?.weightedScore || 0) * 0.24 +
      (c?.coherenceScore || 0) * 0.14 +
      (t?.trailerPriorityScore || 0) * 0.18 -
      (s?.derivedSaturationIndex || 0) * 0.08 -
      (d?.decayRiskScore || 0) * 0.06;

    return {
      ...signal,
      gravityScore: g?.gravityScore || 0,
      gravityBand: g?.gravityBand || "low",
      trailerPriorityScore: t?.trailerPriorityScore || 0,
      trailerPriorityBand: t?.trailerPriorityBand || "none",
      derivedSaturationIndex: s?.derivedSaturationIndex || 0,
      saturationBand: s?.saturationBand || "low",
      decayRiskScore: d?.decayRiskScore || 0,
      decayState: d?.decayState || "stable",
      coherenceScore: c?.coherenceScore || 0,
      culturalTags: cu?.culturalTags || [],
      derivedEmotionTags: e?.derivedEmotionTags || signal.emotionTags || [],
      platformWeight: w?.platformWeight || 1,
      weightedScore: w?.weightedScore || 0,
      finalRankScore: Number(finalRankScore.toFixed(4)),
    };
  });

  return ranked.sort((a, b) => b.finalRankScore - a.finalRankScore);
}

export async function writePrecomputedRanking(signals: LumoraSignal[]): Promise<RankingSnapshot> {
  await ensureDir();
  const ranked = precomputeRanking(signals);
  const snapshot: RankingSnapshot = {
    ok: true,
    count: ranked.length,
    updatedAt: Date.now(),
    signals: ranked,
  };
  await fs.writeFile(OUT_FILE, JSON.stringify(snapshot, null, 2), "utf8");
  return snapshot;
}

export async function readPrecomputedRanking(): Promise<RankingSnapshot> {
  await ensureDir();
  try {
    const raw = await fs.readFile(OUT_FILE, "utf8");
    const parsed = JSON.parse(raw) as RankingSnapshot;
    return {
      ok: true,
      count: Array.isArray(parsed?.signals) ? parsed.signals.length : 0,
      updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      signals: Array.isArray(parsed?.signals) ? parsed.signals : [],
    };
  } catch {
    return {
      ok: true,
      count: 0,
      updatedAt: Date.now(),
      signals: [],
    };
  }
}
