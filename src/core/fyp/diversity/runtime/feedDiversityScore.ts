import type {
  DiversityFeedItem,
  DiversityResult
} from "../types";

export function calculateFeedDiversity(
  items: DiversityFeedItem[]
): DiversityResult[] {
  const map = new Map<string, DiversityFeedItem[]>();

  for (const item of items) {
    const current = map.get(item.lane) ?? [];
    current.push(item);
    map.set(item.lane, current);
  }

  return Array.from(map.entries()).map(([lane, laneItems]) => ({
    lane: lane as DiversityResult["lane"],
    count: laneItems.length,
    score: Math.min(100, laneItems.length * 20)
  }));
}
