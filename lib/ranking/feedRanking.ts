export type FeedItem = {
  id: string;
  createdAt: number;
  watchTime?: number;
  likes?: number;
  skips?: number;
};

export type RankingWeights = {
  recency: number;
  engagement: number;
  quality: number;
};

const DEFAULT_WEIGHTS: RankingWeights = {
  recency: 0.35,
  engagement: 0.35,
  quality: 0.3
};

function normalize(value: number, max: number): number {
  if (!max || max <= 0) return 0;
  return Math.min(value / max, 1);
}

export function rankFeed(
  items: FeedItem[],
  weights: RankingWeights = DEFAULT_WEIGHTS
): FeedItem[] {
  if (!Array.isArray(items) || items.length === 0) return [];

  const now = Date.now();
  const maxLikes = Math.max(...items.map((i) => i.likes ?? 0), 1);
  const maxWatch = Math.max(...items.map((i) => i.watchTime ?? 0), 1);
  const maxSkips = Math.max(...items.map((i) => i.skips ?? 0), 1);

  const scored = items.map((item) => {
    const ageMs = Math.max(0, now - item.createdAt);
    const recencyScore = Math.exp(-ageMs / (1000 * 60 * 60 * 24));

    const likeScore = normalize(item.likes ?? 0, maxLikes);
    const watchScore = normalize(item.watchTime ?? 0, maxWatch);
    const skipScore = normalize(item.skips ?? 0, maxSkips);

    const engagementScore = likeScore * 0.55 + watchScore * 0.45;
    const qualityScore = engagementScore;

    const baseScore =
      recencyScore * weights.recency +
      engagementScore * weights.engagement +
      qualityScore * weights.quality;

    const total = baseScore - skipScore * 0.75;

    return { item, score: total };
  });

  return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
}
