import fs from "node:fs/promises";
import path from "node:path";
import { readSignalStore } from "@/lib/signals/store/fileStore";
import { writePrecomputedRanking } from "@/lib/intelligence/ranking/precompute";
import { refreshEnrichedSignalStore } from "@/lib/intelligence/storage/enrichedStore";
import { setInferenceCache } from "@/lib/intelligence/cache/inferenceCache";

export type RecomputeRun = {
  runId: string;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  signalCount: number;
  rankingCount: number;
  enrichedCount: number;
  cacheKey: string;
  ok: boolean;
};

export type RecomputeState = {
  updatedAt: number;
  lastRun: RecomputeRun | null;
  intervalMs: number;
};

const OUT_DIR = path.join(process.cwd(), "data", "intelligence");
const STATE_FILE = path.join(OUT_DIR, "recompute.scheduler.state.json");

let timer: NodeJS.Timeout | null = null;
let running = false;

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

export async function readRecomputeState(): Promise<RecomputeState> {
  await ensureDir();
  try {
    const raw = await fs.readFile(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as RecomputeState;
    return {
      updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      intervalMs: typeof parsed?.intervalMs === "number" ? parsed.intervalMs : 5 * 60 * 1000,
      lastRun: parsed?.lastRun ?? null,
    };
  } catch {
    return {
      updatedAt: Date.now(),
      intervalMs: 5 * 60 * 1000,
      lastRun: null,
    };
  }
}

async function writeRecomputeState(state: RecomputeState): Promise<RecomputeState> {
  await ensureDir();
  const safe: RecomputeState = {
    updatedAt: Date.now(),
    intervalMs: state.intervalMs,
    lastRun: state.lastRun,
  };
  await fs.writeFile(STATE_FILE, JSON.stringify(safe, null, 2), "utf8");
  return safe;
}

export async function runRecomputeNow(cacheKey = "enriched_top_signals"): Promise<RecomputeRun> {
  if (running) {
    const now = Date.now();
    return {
      runId: `recompute_busy_${now}`,
      startedAt: now,
      finishedAt: now,
      durationMs: 0,
      signalCount: 0,
      rankingCount: 0,
      enrichedCount: 0,
      cacheKey,
      ok: false,
    };
  }

  running = true;
  const startedAt = Date.now();

  try {
    const signalSnapshot = await readSignalStore();
    const rankingSnapshot = await writePrecomputedRanking(signalSnapshot.signals);
    const enrichedSnapshot = await refreshEnrichedSignalStore();
    setInferenceCache(cacheKey, enrichedSnapshot.signals.slice(0, 25), 5 * 60 * 1000);

    const finishedAt = Date.now();
    const run: RecomputeRun = {
      runId: `recompute_${startedAt}`,
      startedAt,
      finishedAt,
      durationMs: finishedAt - startedAt,
      signalCount: signalSnapshot.count,
      rankingCount: rankingSnapshot.count,
      enrichedCount: enrichedSnapshot.count,
      cacheKey,
      ok: true,
    };

    const current = await readRecomputeState();
    await writeRecomputeState({
      ...current,
      lastRun: run,
    });

    return run;
  } finally {
    running = false;
  }
}

export async function startRecomputeScheduler(intervalMs = 5 * 60 * 1000): Promise<RecomputeState> {
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    void runRecomputeNow();
  }, Math.max(30_000, intervalMs));

  const current = await readRecomputeState();
  return writeRecomputeState({
    ...current,
    intervalMs: Math.max(30_000, intervalMs),
  });
}

export async function stopRecomputeScheduler(): Promise<RecomputeState> {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  return readRecomputeState();
}

export function getSchedulerRuntime() {
  return {
    active: !!timer,
    running,
  };
}
