import fs from "node:fs/promises";
import path from "node:path";
import type { LumoraSignal } from "@/types/lumora.signal";

export type SignalStoreSnapshot = {
  ok: boolean;
  count: number;
  updatedAt: number;
  signals: LumoraSignal[];
};

const STORE_DIR = path.join(process.cwd(), "data", "signals");
const STORE_FILE = path.join(STORE_DIR, "central.signal.store.json");

async function ensureStoreDir() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

export async function readSignalStore(): Promise<SignalStoreSnapshot> {
  await ensureStoreDir();

  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as SignalStoreSnapshot;
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

export async function writeSignalStore(signals: LumoraSignal[]): Promise<SignalStoreSnapshot> {
  await ensureStoreDir();

  const snapshot: SignalStoreSnapshot = {
    ok: true,
    count: Array.isArray(signals) ? signals.length : 0,
    updatedAt: Date.now(),
    signals: Array.isArray(signals) ? signals : [],
  };

  await fs.writeFile(STORE_FILE, JSON.stringify(snapshot, null, 2), "utf8");
  return snapshot;
}

export async function upsertSignalStore(signals: LumoraSignal[]): Promise<SignalStoreSnapshot> {
  const existing = await readSignalStore();
  const map = new Map<string, LumoraSignal>();

  for (const signal of existing.signals) {
    map.set(signal.id, signal);
  }

  for (const signal of signals) {
    const prev = map.get(signal.id);
    if (!prev) {
      map.set(signal.id, signal);
      continue;
    }

    const prevScore = (prev.velocityScore || 0) + (prev.attentionScore || 0);
    const nextScore = (signal.velocityScore || 0) + (signal.attentionScore || 0);

    if (nextScore >= prevScore || (signal.updatedAt || 0) >= (prev.updatedAt || 0)) {
      map.set(signal.id, signal);
    }
  }

  return writeSignalStore(Array.from(map.values()));
}
