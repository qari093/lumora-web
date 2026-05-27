import { getFyp94Decade } from "./decade";

export function mixFyp94TimeMachine(items: any[]) {
  const buckets: Record<string, any[]> = {};

  for (const item of items) {
    const decade = getFyp94Decade(item);
    if (!buckets[decade]) buckets[decade] = [];
    buckets[decade].push({ ...item, decade });
  }

  const keys = Object.keys(buckets);
  const out: any[] = [];
  let active = true;

  while (active) {
    active = false;

    for (const key of keys) {
      const next = buckets[key].shift();
      if (next) {
        out.push(next);
        active = true;
      }
    }
  }

  return out;
}

export function preventSameEraStreak(items: any[], maxStreak = 2) {
  const out: any[] = [];
  let last = "";
  let streak = 0;

  for (const item of items) {
    const era = item.decade || getFyp94Decade(item);

    if (era === last) streak++;
    else streak = 1;

    if (streak <= maxStreak) {
      out.push(item);
      last = era;
      continue;
    }

    const swapIndex = items.findIndex((candidate) => {
      const candidateEra = candidate.decade || getFyp94Decade(candidate);
      return candidateEra !== era && !out.includes(candidate);
    });

    if (swapIndex >= 0) {
      const swap = items[swapIndex];
      out.push(swap);
      last = swap.decade || getFyp94Decade(swap);
      streak = 1;
    }
  }

  return out;
}
