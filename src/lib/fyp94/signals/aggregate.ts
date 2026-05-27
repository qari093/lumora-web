import type { Fyp94SignalWeight, Fyp94SwerveSignal } from "./types";

const TYPE_WEIGHT: Record<Fyp94SwerveSignal["type"], number> = {
  more_like_this: 1,
  different: -0.75,
  switch_category: -0.35,
};

export function aggregateFyp94SwerveSignals(signals: Fyp94SwerveSignal[]): Fyp94SignalWeight[] {
  const map = new Map<string, Fyp94SignalWeight>();

  for (const signal of signals) {
    const current = map.get(signal.category) ?? {
      category: signal.category,
      weight: 0,
      tags: {},
    };

    const delta = TYPE_WEIGHT[signal.type];
    current.weight += delta;

    for (const tag of signal.tags) {
      current.tags[tag] = (current.tags[tag] ?? 0) + delta;
    }

    map.set(signal.category, current);
  }

  return [...map.values()].sort((a, b) => b.weight - a.weight);
}
