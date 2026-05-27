import type { NativeFypVideo } from "../schema";

export type SessionSignal = {
  id: string;
  dwellMs?: number;
  skipped?: boolean;
  stashed?: boolean;
};

export function scoreSessionSignal(signal: SessionSignal): number {
  let score = 0;

  if (signal.dwellMs) score += Math.min(signal.dwellMs / 1000, 10);
  if (signal.skipped) score -= 5;
  if (signal.stashed) score += 8;

  return score;
}

export function rerankBySessionSignals(
  items: NativeFypVideo[],
  signals: SessionSignal[],
): NativeFypVideo[] {
  const scores = new Map(signals.map((s) => [s.id, scoreSessionSignal(s)]));

  return [...items].sort((a, b) => {
    return (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0);
  });
}
