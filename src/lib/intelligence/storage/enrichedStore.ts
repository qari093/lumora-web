import fs from "node:fs/promises";
import path from "node:path";
import { readPrecomputedRanking } from "@/lib/intelligence/ranking/precompute";

export type EnrichedSignalSnapshot = {
  ok: boolean;
  count: number;
  updatedAt: number;
  signals: unknown[];
};

const OUT_DIR = path.join(process.cwd(), "data", "intelligence");
const OUT_FILE = path.join(OUT_DIR, "enriched.signals.store.json");

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

export async function readEnrichedSignalStore(): Promise<EnrichedSignalSnapshot> {
  await ensureDir();

  try {
    const raw = await fs.readFile(OUT_FILE, "utf8");
    const parsed = JSON.parse(raw) as EnrichedSignalSnapshot;

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

export async function writeEnrichedSignalStore(signals: unknown[]): Promise<EnrichedSignalSnapshot> {
  await ensureDir();

  const snapshot: EnrichedSignalSnapshot = {
    ok: true,
    count: Array.isArray(signals) ? signals.length : 0,
    updatedAt: Date.now(),
    signals: Array.isArray(signals) ? signals : [],
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(snapshot, null, 2), "utf8");
  return snapshot;
}

export async function refreshEnrichedSignalStore(): Promise<EnrichedSignalSnapshot> {
  const ranking = await readPrecomputedRanking();
  return writeEnrichedSignalStore(ranking.signals);
}
