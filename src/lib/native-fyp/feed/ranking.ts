import type { NativeFypVideo } from "../schema";

type ScoreInput = NativeFypVideo & {
  views?: number;
  completionRate?: number;
  skipRate?: number;
  stashCount?: number;
};

export function scoreVideo(v: ScoreInput): number {
  const freshness = Date.now() - new Date(v.createdAt).getTime();
  const freshnessScore = Math.max(0, 1 - freshness / (1000 * 60 * 60 * 24));

  const completion = v.completionRate ?? 0.5;
  const skipPenalty = 1 - (v.skipRate ?? 0.2);
  const stashBoost = 1 + (v.stashCount ?? 0) * 0.05;

  return freshnessScore * 0.4 + completion * 0.3 + skipPenalty * 0.2 + stashBoost * 0.1;
}

export function rankFeed(items: ScoreInput[]): NativeFypVideo[] {
  return [...items].sort((a, b) => scoreVideo(b) - scoreVideo(a));
}

export function buildRankedQueue(items: NativeFypVideo[]): NativeFypVideo[] {
  return rankFeed(items).slice(0, 20);
}
