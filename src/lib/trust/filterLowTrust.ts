import fs from 'node:fs/promises';
import path from 'node:path';
import { readEnrichedSignalStore } from '@/lib/intelligence/storage/enrichedStore';
import { computeTrustBatch } from '@/src/lib/trust/trustScore';

export type TrustedFilterSnapshot = {
  ok: boolean;
  totalIn: number;
  totalOut: number;
  blocked: number;
  updatedAt: number;
  signals: unknown[];
};

const OUT_DIR = path.join(process.cwd(), 'data', 'trust');
const OUT_FILE = path.join(OUT_DIR, 'trusted.signals.store.json');

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

export async function readTrustedSignalStore(): Promise<TrustedFilterSnapshot> {
  await ensureDir();

  try {
    const raw = await fs.readFile(OUT_FILE, 'utf8');
    const parsed = JSON.parse(raw) as TrustedFilterSnapshot;

    return {
      ok: true,
      totalIn: typeof parsed?.totalIn === 'number' ? parsed.totalIn : 0,
      totalOut: Array.isArray(parsed?.signals) ? parsed.signals.length : 0,
      blocked: typeof parsed?.blocked === 'number' ? parsed.blocked : 0,
      updatedAt: typeof parsed?.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
      signals: Array.isArray(parsed?.signals) ? parsed.signals : [],
    };
  } catch {
    return {
      ok: true,
      totalIn: 0,
      totalOut: 0,
      blocked: 0,
      updatedAt: Date.now(),
      signals: [],
    };
  }
}

export async function writeTrustedSignalStore(
  signals: unknown[],
  totalIn: number,
  blocked: number,
): Promise<TrustedFilterSnapshot> {
  await ensureDir();

  const snapshot: TrustedFilterSnapshot = {
    ok: true,
    totalIn,
    totalOut: Array.isArray(signals) ? signals.length : 0,
    blocked,
    updatedAt: Date.now(),
    signals: Array.isArray(signals) ? signals : [],
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(snapshot, null, 2), 'utf8');
  return snapshot;
}

export async function filterLowTrustSignals(): Promise<TrustedFilterSnapshot> {
  const enriched = await readEnrichedSignalStore();
  const signals = Array.isArray(enriched.signals) ? enriched.signals : [];
  const trust = computeTrustBatch(signals);

  const trustById = new Map(trust.map((t) => [t.signalId, t]));
  const allowed = signals.filter((signal: any) => {
    const t = trustById.get(String(signal.id || ''));
    return t && (t.trustLevel === 'high' || t.trustLevel === 'medium');
  });

  const blocked = signals.length - allowed.length;
  return writeTrustedSignalStore(allowed, signals.length, blocked);
}
