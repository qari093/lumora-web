import type { LumoraSignal, LumoraSourcePlatform } from "@/types/lumora.signal";

export type WeightedSignal = LumoraSignal & {
  platformWeight: number;
  weightedScore: number;
  weightingReason: string;
};

const PLATFORM_WEIGHTS: Record<LumoraSourcePlatform, number> = {
  google_trends: 1.2,
  news_rss: 1.15,
  twitter_x: 1.1,
  reddit: 1.05,
  twitch: 1.0,
  tiktok: 0.98,
  instagram: 0.97,
  internal: 0.9,
};

function getPlatformWeight(platform: LumoraSourcePlatform): number {
  return PLATFORM_WEIGHTS[platform] ?? 1.0;
}

export function applySignalWeight(signal: LumoraSignal): WeightedSignal {
  const baseScore =
    (signal.velocityScore || 0) * 0.45 +
    (signal.attentionScore || 0) * 0.35 -
    (signal.saturationScore || 0) * 0.2;

  const platformWeight = getPlatformWeight(signal.platform);
  const weightedScore = Number((baseScore * platformWeight).toFixed(4));

  return {
    ...signal,
    platformWeight,
    weightedScore,
    weightingReason: `base_score * platform_weight(${signal.platform})`,
  };
}

export function applySignalWeights(signals: LumoraSignal[]): WeightedSignal[] {
  return (Array.isArray(signals) ? signals : [])
    .map(applySignalWeight)
    .sort((a, b) => b.weightedScore - a.weightedScore);
}
