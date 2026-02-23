import { shouldEscalateToOrigin, DEFAULT_WORKER_CPU_BUDGET_MS } from "@/lib/edge/compute/workerBudget";

export type FeedItem = Readonly<{
  id: string;
  kind: "ugc" | "trailer";
  score: number;
}>;

export type SmartMixInput = Readonly<{
  items: ReadonlyArray<FeedItem>;
  // Estimated CPU ms to execute this assembly on the edge.
  expectedCpuMs: number;
  // Optional override; defaults to 50ms per doctrine.
  budgetMs?: number;
}>;

export type SmartMixResult = Readonly<
  | { ok: true; mode: "worker"; items: ReadonlyArray<FeedItem>; remainingMs: number }
  | { ok: true; mode: "origin"; reason: string }
>;

function stableSortDesc(items: ReadonlyArray<FeedItem>): ReadonlyArray<FeedItem> {
  // Deterministic order: score desc, then id asc
  return [...items].sort((a, b) => (b.score - a.score) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * Contract:
 * - "Smart Mix" assembly must respect the Worker CPU budget (<50ms default).
 * - If expectedCpuMs exceeds the budget, return mode:"origin" (escalate).
 * - On Worker, result must be deterministic and stable.
 */
export function assembleSmartMix(input: SmartMixInput): SmartMixResult {
  const decision = shouldEscalateToOrigin({
    expectedCpuMs: input.expectedCpuMs,
    budgetMs: input.budgetMs ?? DEFAULT_WORKER_CPU_BUDGET_MS,
  });

  if (decision.escalate) {
    return { ok: true, mode: "origin", reason: decision.reason };
  }

  const out = stableSortDesc(input.items);
  return { ok: true, mode: "worker", items: out, remainingMs: decision.remainingMs };
}

/* LUMORA_COMPAT_SMARTMIX_EXPORTS_v1:start */
/**
 * Compat export for callers expecting buildSmartMix().
 * Keep deterministic and side-effect free.
 */
export type SmartMixItem = Record<string, any>;

export type BuildSmartMixArgs = {
  candidates?: SmartMixItem[];
  limit?: number;
  seed?: string;
};

function _hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function _pickDeterministic<T>(arr: T[], limit: number, seed: string): T[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const lim = Math.max(0, Math.min(limit, arr.length));
  if (lim === 0) return [];
  const h = _hashSeed(seed);
  // simple stride walk (coprime stride best-effort)
  const stride = (h % (arr.length - 1 || 1)) + 1;
  const out: T[] = [];
  let idx = h % arr.length;
  const seen = new Set<number>();
  while (out.length < lim && seen.size < arr.length) {
    if (!seen.has(idx)) {
      out.push(arr[idx]);
      seen.add(idx);
    }
    idx = (idx + stride) % arr.length;
  }
  return out;
}

export function buildSmartMix(args: BuildSmartMixArgs = {}): { ok: true; items: SmartMixItem[] } {
  const candidates = Array.isArray(args.candidates) ? args.candidates : [];
  const limit = typeof args.limit === "number" ? args.limit : 30;
  const seed = typeof args.seed === "string" ? args.seed : "lumora";
  return { ok: true, items: _pickDeterministic(candidates, limit, seed) };
}
/* LUMORA_COMPAT_SMARTMIX_EXPORTS_v1:end */
