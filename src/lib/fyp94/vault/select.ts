import type { Fyp94VaultClip } from "./types";

export function selectFyp94VaultClips(input: {
  clips: Fyp94VaultClip[];
  limit?: number;
  minThrillScore?: number;
}): Fyp94VaultClip[] {
  const limit = input.limit ?? 20;
  const minThrillScore = input.minThrillScore ?? 75;

  return [...input.clips]
    .filter((clip) => clip.thrillScore >= minThrillScore)
    .sort((a, b) => b.thrillScore - a.thrillScore)
    .slice(0, limit);
}
