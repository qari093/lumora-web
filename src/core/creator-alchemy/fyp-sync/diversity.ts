import type { FypCreatorSignal } from "./types";

export function calculateFeedEmotionalDiversity(signals: readonly FypCreatorSignal[]): number {
  if (signals.length === 0) return 0;
  const unique = new Set(signals.map((signal) => signal.constellation));
  return unique.size / signals.length;
}

export function shouldInjectOppositeConstellation(diversityScore: number): boolean {
  return diversityScore < 0.35;
}
