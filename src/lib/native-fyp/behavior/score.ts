import type { FypEvent } from "./events";

export function scoreAdjustment(events: FypEvent[]): Record<string, number> {
  const score: Record<string, number> = {};

  for (const e of events) {
    if (!score[e.id]) score[e.id] = 0;

    if (e.type === "view") score[e.id] += Math.min(e.duration / 5, 5);
    if (e.type === "skip") score[e.id] -= 3;
    if (e.type === "stash") score[e.id] += 5;
  }

  return score;
}
