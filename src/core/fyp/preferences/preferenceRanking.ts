import type { FypPreferenceProfile } from "./preferenceTypes";

export interface FypPreferenceRankableAsset {
  id: string;
  lane: string;
  baseScore: number;
}

export function applyPreferenceRanking(
  assets: FypPreferenceRankableAsset[],
  profile: FypPreferenceProfile
): FypPreferenceRankableAsset[] {
  return [...assets].sort((a, b) => {
    const aw = profile.laneWeights[a.lane] ?? 1;
    const bw = profile.laneWeights[b.lane] ?? 1;
    return b.baseScore * bw - a.baseScore * aw;
  });
}
