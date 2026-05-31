import type { PulseSignal } from "./types";
import { isSignalActive } from "./signalEngine";

export function scorePulseSignal(signal: PulseSignal): number {
  return Math.round(
    signal.emotionalWeight * 0.4 +
    signal.trustScore * 0.35 +
    signal.freshness * 0.25,
  );
}

export function rankPulseSignals(signals: PulseSignal[]): PulseSignal[] {
  const active = signals.filter((signal) => isSignalActive(signal));

  return active.sort((a, b) => {
    const delta = scorePulseSignal(b) - scorePulseSignal(a);
    return delta !== 0 ? delta : a.id.localeCompare(b.id);
  });
}

export function applySignalDiversity(signals: PulseSignal[], maxPerKey = 2): PulseSignal[] {
  const counts = new Map<string, number>();
  const out: PulseSignal[] = [];

  for (const signal of signals) {
    const count = counts.get(signal.diversityKey) ?? 0;
    if (count >= maxPerKey) continue;
    counts.set(signal.diversityKey, count + 1);
    out.push(signal);
  }

  return out;
}
