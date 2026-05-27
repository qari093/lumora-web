export function evictOldest<T extends { ts: number }>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  return items
    .sort((a, b) => a.ts - b.ts)
    .slice(items.length - max);
}
