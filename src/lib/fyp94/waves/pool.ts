import type { Fyp94MomentWave, Fyp94WaveClip } from "./types";

export function returnFyp94WaveClipsToPool(input: {
  wave: Fyp94MomentWave;
  clips: Fyp94WaveClip[];
}): Fyp94WaveClip[] {
  const waveClipIds = new Set(input.wave.clipIds);
  return input.clips.map((clip) => ({
    ...clip,
    thrillScore: waveClipIds.has(clip.id) ? Math.max(0, clip.thrillScore - 5) : clip.thrillScore,
  }));
}
