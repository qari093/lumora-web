import type { Fyp94VaultClip } from "./types";

export function recycleFyp94VaultClipsToPool(input: {
  vaultClipIds: string[];
  clips: Fyp94VaultClip[];
}): Fyp94VaultClip[] {
  const ids = new Set(input.vaultClipIds);

  return input.clips.map((clip) => ({
    ...clip,
    thrillScore: ids.has(clip.id) ? Math.max(0, clip.thrillScore - 3) : clip.thrillScore,
  }));
}
