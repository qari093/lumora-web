export function splitFyp94ArchiveWindow<T extends { id?: number }>(
  items: T[],
  maxItems: number,
): { active: T[]; archived: T[] } {
  if (items.length <= maxItems) return { active: items, archived: [] };

  const sorted = [...items].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
  const archived = sorted.slice(0, sorted.length - maxItems);
  const active = sorted.slice(sorted.length - maxItems);

  return { active, archived };
}

export function validateFyp94Freshness(items: any[], minPlayableItems = 30) {
  const playable = items.filter((item) => item.localUrl && item.source && item.query);

  return {
    ok: playable.length >= minPlayableItems,
    playableCount: playable.length,
    minPlayableItems,
  };
}
