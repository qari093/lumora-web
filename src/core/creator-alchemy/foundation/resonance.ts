import type { ResonanceSignal, SymbolicMoment } from "./types";

export interface ResonanceEvent {
  signal: ResonanceSignal;
  weight: number;
  occurredAt: string;
}

export interface ResonanceScore {
  score: number;
  symbolicState: SymbolicMoment;
}

const SIGNAL_WEIGHTS: Record<ResonanceSignal, number> = {
  rewatch: 8,
  linger: 7,
  save: 9,
  completion: 5,
  quiet_gift: 10,
  constellation_affinity: 6,
  creator_curiosity: 4
};

export function scoreResonance(events: readonly ResonanceEvent[]): ResonanceScore {
  const score = events.reduce((total, event) => {
    const base = SIGNAL_WEIGHTS[event.signal] ?? 0;
    const safeWeight = Number.isFinite(event.weight) ? Math.max(0, Math.min(event.weight, 3)) : 0;
    return total + base * safeWeight;
  }, 0);

  return {
    score,
    symbolicState: toSymbolicState(score)
  };
}

export function toSymbolicState(score: number): SymbolicMoment {
  if (score >= 120) return "resonant_tide";
  if (score >= 80) return "glowing_river";
  if (score >= 40) return "blooming_current";
  return "quiet_lake";
}
