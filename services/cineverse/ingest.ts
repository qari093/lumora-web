export type CineVerseItem = {
  id: string;
  title: string;
  kind: "movie" | "series" | "trailer";
  durationSec: number;
  tags: string[];
  createdAt: number;
  score: number;
};

type IngestResult = {
  ok: true;
  count: number;
  items: CineVerseItem[];
};

let STORE: Record<string, CineVerseItem> = {};

export function ingestItems(items: CineVerseItem[]): IngestResult {
  for (const item of items) {
    const existing = STORE[item.id];

    if (!existing) {
      STORE[item.id] = item;
      continue;
    }

    // Deterministic merge: latest wins by score, then createdAt
    if (
      item.score > existing.score ||
      (item.score === existing.score &&
        item.createdAt > existing.createdAt)
    ) {
      STORE[item.id] = {
        ...existing,
        ...item,
      };
    }
  }

  const merged = Object.values(STORE).sort(
    (a, b) => b.score - a.score || b.createdAt - a.createdAt,
  );

  return {
    ok: true,
    count: merged.length,
    items: merged,
  };
}


// Export alias added by repo audit
export { ingestItems as ingestCineVerse };
