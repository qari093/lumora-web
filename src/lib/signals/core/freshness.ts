import type { LumoraSignal } from "@/types/lumora.signal";

export type FreshSignal = LumoraSignal & {
  ttlMs: number;
  expiresAt: number;
  isExpired: boolean;
};

function ttlForLifecycle(lifecycle?: string): number {
  switch (lifecycle) {
    case "rising":
      return 2 * 60 * 60 * 1000; // 2h
    case "peaking":
      return 6 * 60 * 60 * 1000; // 6h
    case "decaying":
      return 24 * 60 * 60 * 1000; // 24h
    case "archived":
      return 72 * 60 * 60 * 1000; // 72h
    default:
      return 6 * 60 * 60 * 1000;
  }
}

export function attachFreshness(signal: LumoraSignal): FreshSignal {
  const ttlMs = ttlForLifecycle(signal.lifecycle);
  const baseTs = signal.updatedAt || signal.createdAt || Date.now();
  const expiresAt = baseTs + ttlMs;
  const isExpired = Date.now() >= expiresAt;

  return {
    ...signal,
    ttlMs,
    expiresAt,
    isExpired,
  };
}

export function attachFreshnessBatch(signals: LumoraSignal[]): FreshSignal[] {
  return (Array.isArray(signals) ? signals : []).map(attachFreshness);
}

export function filterFreshSignals(signals: LumoraSignal[]): FreshSignal[] {
  return attachFreshnessBatch(signals).filter((signal) => !signal.isExpired);
}
