export type FallbackCardKind =
  | "poster-only"
  | "title-release"
  | "watchlist-cta"
  | "discussion-cta"
  | "metadata-only";

export type RankedFallbackCard = {
  id: string;
  kind: FallbackCardKind;
  freshnessScore: number;
  trustScore: number;
  relevanceScore: number;
  fallbackPenalty: number;
};

export function computeFallbackRankingScore(
  card: RankedFallbackCard
): number {
  const kindBonus =
    card.kind === "poster-only"
      ? 12
      : card.kind === "title-release"
      ? 8
      : card.kind === "metadata-only"
      ? 6
      : card.kind === "discussion-cta"
      ? 4
      : 2;

  return Math.round(
    card.freshnessScore * 0.3 +
      card.trustScore * 0.3 +
      card.relevanceScore * 0.3 +
      kindBonus -
      card.fallbackPenalty * 0.2
  );
}

export function rankFallbackCards<T extends RankedFallbackCard>(
  cards: T[]
): T[] {
  return [...cards].sort((a, b) => {
    const scoreDelta =
      computeFallbackRankingScore(b) - computeFallbackRankingScore(a);
    if (scoreDelta !== 0) return scoreDelta;
    return a.id.localeCompare(b.id);
  });
}
