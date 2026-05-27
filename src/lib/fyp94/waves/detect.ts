import type { Fyp94WaveClip } from "./types";

export function detectFyp94HighScoreCluster(input: {
  clips: Fyp94WaveClip[];
  minScore?: number;
  minCount?: number;
}): { eligible: boolean; category?: string; clips: Fyp94WaveClip[] } {
  const minScore = input.minScore ?? 75;
  const minCount = input.minCount ?? 3;

  const byCategory = input.clips
    .filter((clip) => clip.thrillScore >= minScore)
    .reduce<Record<string, Fyp94WaveClip[]>>((acc, clip) => {
      acc[clip.category] ||= [];
      acc[clip.category].push(clip);
      return acc;
    }, {});

  const best = Object.entries(byCategory).sort((a, b) => b[1].length - a[1].length)[0];

  if (!best || best[1].length < minCount) {
    return { eligible: false, clips: [] };
  }

  return { eligible: true, category: best[0], clips: best[1] };
}
