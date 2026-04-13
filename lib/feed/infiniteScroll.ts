export type FeedPageItem = {
  id: string;
  createdAt: number;
};

export type FeedPage = {
  items: FeedPageItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type FeedQuery = {
  limit?: number;
  cursor?: string | null;
};

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function clampLimit(limit?: number): number {
  if (!Number.isFinite(limit)) return DEFAULT_LIMIT;
  const safe = Math.trunc(limit as number);
  if (safe <= 0) return DEFAULT_LIMIT;
  return Math.min(safe, MAX_LIMIT);
}

export function buildFeedPage(
  allItems: FeedPageItem[],
  query: FeedQuery
): FeedPage {
  const limit = clampLimit(query.limit);
  const sorted = [...allItems].sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id));

  let startIndex = 0;
  if (query.cursor) {
    const idx = sorted.findIndex((item) => item.id === query.cursor);
    startIndex = idx >= 0 ? idx + 1 : 0;
  }

  const pageItems = sorted.slice(startIndex, startIndex + limit);
  const lastItem = pageItems[pageItems.length - 1] ?? null;
  const nextIndex = startIndex + pageItems.length;
  const hasMore = nextIndex < sorted.length;

  return {
    items: pageItems,
    nextCursor: hasMore && lastItem ? lastItem.id : null,
    hasMore
  };
}

export function mergeFeedPages(
  existing: FeedPageItem[],
  incoming: FeedPageItem[]
): FeedPageItem[] {
  const seen = new Set<string>();
  const merged: FeedPageItem[] = [];

  for (const item of [...existing, ...incoming]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }

  return merged.sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id));
}
