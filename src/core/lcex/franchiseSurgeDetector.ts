export type FranchiseSurgeSample = {
  franchiseKey: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  mentionDelta: number;
  searchDelta: number;
  creatorDelta: number;
  detectedAt: string;
};

export type FranchiseSurgeResult = {
  franchiseKey: string;
  score: number;
  surged: boolean;
  detectedAt: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreFranchiseSurge(sample: FranchiseSurgeSample): number {
  return clampScore(
    sample.mentionDelta * 0.4 +
      sample.searchDelta * 0.35 +
      sample.creatorDelta * 0.25
  );
}

export function detectFranchiseSurge(
  sample: FranchiseSurgeSample
): FranchiseSurgeResult {
  const score = scoreFranchiseSurge(sample);

  return {
    franchiseKey: sample.franchiseKey,
    score,
    surged: score >= 70,
    detectedAt: sample.detectedAt,
  };
}
