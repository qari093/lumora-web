import type { Fyp94CategoryHeat, Fyp94CrowdSignal } from "./types";

export function calculateFyp94CategoryHeat(signals: Fyp94CrowdSignal[]): Fyp94CategoryHeat[] {
  const totals = signals.reduce<Record<string, number>>((acc, signal) => {
    acc[signal.category] = (acc[signal.category] ?? 0) + signal.viewerCount;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([category, totalViewers]) => ({
      category,
      totalViewers,
      heatLevel: (totalViewers >= 500 ? "high" : totalViewers >= 100 ? "medium" : "low") as "low" | "medium" | "high",
    }))
    .sort((a, b) => b.totalViewers - a.totalViewers);
}
