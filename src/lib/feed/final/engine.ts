export type FinalFeedItem = {
  id: string | number;
  rankScore?: number;
  [key: string]: unknown;
};

export function finalizeFeed<T extends FinalFeedItem>(items: readonly T[]): T[] {
  const unique = new Map<string, T>();

  for (const item of items) {
    if (!item || item.id === undefined || item.id === null) {
      continue;
    }

    const key = String(item.id);

    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  return [...unique.values()].sort(
    (left, right) =>
      (typeof right.rankScore === "number" ? right.rankScore : 0) -
      (typeof left.rankScore === "number" ? left.rankScore : 0)
  );
}
