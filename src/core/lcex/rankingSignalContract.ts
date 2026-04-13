export type RankingSignalContract = {
  id: string;
  entityId: string;
  sourceId: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  freshnessScore: number;
  trustScore: number;
  qualityScore: number;
  trendScore: number;
  culturalScore: number;
  rightsScore: number;
  editorialBoost?: number;
  createdAt: string;
};

export function createRankingSignalContract(
  input: RankingSignalContract
): RankingSignalContract {
  return input;
}

export function computeRankingSignalTotal(
  signal: RankingSignalContract
): number {
  return Math.round(
    signal.freshnessScore * 0.2 +
      signal.trustScore * 0.2 +
      signal.qualityScore * 0.2 +
      signal.trendScore * 0.2 +
      signal.culturalScore * 0.1 +
      signal.rightsScore * 0.1 +
      (signal.editorialBoost ?? 0)
  );
}
