import type { LumoraSignal } from "@/types/lumora.signal";

export type ScoredSignal = LumoraSignal & {
  gravityScore: number;
  freshnessScore: number;
  trustScore: number;
};

function clamp(n: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, n));
}

function computeFreshness(createdAt: number): number {
  const ageMs = Date.now() - createdAt;
  const hours = ageMs / (1000 * 60 * 60);
  return clamp(1 - hours / 48); // decay after 48h
}

function computeTrustScore(trust?: string): number {
  switch (trust) {
    case "verified": return 1.0;
    case "low_trust": return 0.4;
    case "toxic_velocity": return 0.2;
    default: return 0.6;
  }
}

export function scoreSignal(signal: LumoraSignal): ScoredSignal {
  const velocity = signal.velocityScore || 0;
  const attention = signal.attentionScore || 0;
  const saturation = signal.saturationScore || 0;

  const freshness = computeFreshness(signal.createdAt);
  const trust = computeTrustScore(signal.trust);

  // Core Lumora formula
  const gravity =
    (velocity * 0.4) +
    (attention * 0.4) +
    (freshness * 0.2) -
    (saturation * 0.3);

  return {
    ...signal,
    gravityScore: Number(gravity.toFixed(4)),
    freshnessScore: Number(freshness.toFixed(4)),
    trustScore: Number(trust.toFixed(4)),
  };
}

export function scoreSignals(signals: LumoraSignal[]): ScoredSignal[] {
  return (Array.isArray(signals) ? signals : [])
    .map(scoreSignal)
    .sort((a, b) => b.gravityScore - a.gravityScore);
}
