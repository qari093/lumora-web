import type { PreViralSignal } from "./preViralSignalRegistry";

export type SoundtrackSnippetHeatSample = {
  entityId: string;
  category: PreViralSignal["category"];
  source: string;
  snippetReplayRate: number;
  uniqueCreatorRate: number;
  clipReuseRate: number;
  detectedAt: string;
  region?: string;
  language?: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreSoundtrackSnippetHeatSample(
  sample: SoundtrackSnippetHeatSample
): number {
  const replayScore = clampScore(sample.snippetReplayRate);
  const creatorScore = clampScore(sample.uniqueCreatorRate);
  const reuseScore = clampScore(sample.clipReuseRate);

  return clampScore(
    replayScore * 0.45 +
      creatorScore * 0.3 +
      reuseScore * 0.25
  );
}

export function buildSoundtrackSnippetHeatSignal(
  sample: SoundtrackSnippetHeatSample
): PreViralSignal {
  const score = scoreSoundtrackSnippetHeatSample(sample);

  return {
    id: `soundtrack-heat:${sample.entityId}:${sample.detectedAt}`,
    type: "soundtrack-heat",
    entityId: sample.entityId,
    category: sample.category,
    source: sample.source,
    score,
    confidence: clampScore(score * 0.9),
    detectedAt: sample.detectedAt,
    region: sample.region,
    language: sample.language,
    metadata: {
      snippetReplayRate: sample.snippetReplayRate,
      uniqueCreatorRate: sample.uniqueCreatorRate,
      clipReuseRate: sample.clipReuseRate,
    },
  };
}

export function isStrongSoundtrackSnippetHeatSignal(
  sample: SoundtrackSnippetHeatSample
): boolean {
  return scoreSoundtrackSnippetHeatSample(sample) >= 70;
}
