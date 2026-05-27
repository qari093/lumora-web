export type Fyp94FeedIntelligenceItem = {
  id: string;
  category: string;
  playbackUrl: string;
  source?: string;
  [key: string]: unknown;
};

export function mixFyp94CategoriesV2<T extends Fyp94FeedIntelligenceItem>(items: T[]): T[] {
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const key = item.category || "Pulse";
    const bucket = buckets.get(key) ?? [];
    bucket.push(item);
    buckets.set(key, bucket);
  }

  const mixed: T[] = [];

  while ([...buckets.values()].some((bucket) => bucket.length > 0)) {
    const categories = [...buckets.keys()].sort((a, b) => {
      const av = buckets.get(a)?.length ?? 0;
      const bv = buckets.get(b)?.length ?? 0;
      return bv - av;
    });

    for (const category of categories) {
      const bucket = buckets.get(category);
      const next = bucket?.shift();
      if (next) mixed.push(next);
      if (!bucket?.length) buckets.delete(category);
    }
  }

  return mixed;
}

export function shuffleFyp94Session<T>(items: T[], seed = Date.now()): T[] {
  const out = [...items];

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.abs((seed + i * 9301 + 49297) % (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export function filterFyp94SeenHistory<T extends Fyp94FeedIntelligenceItem>(
  items: T[],
  seenIds: string[],
): T[] {
  const seen = new Set(seenIds);
  const fresh = items.filter((item) => !seen.has(item.id));
  return fresh.length >= 5 ? fresh : items;
}
