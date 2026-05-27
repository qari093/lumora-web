import type { MediaRuntimeDecision } from "./types";

export type MediaRuntimeSeal = {
  checked: number;
  playable: number;
  ready: boolean;
};

export function createMediaRuntimeSeal(
  decisions: MediaRuntimeDecision[]
): MediaRuntimeSeal {
  const playable = decisions.filter(decision => decision.playable).length;

  return {
    checked: decisions.length,
    playable,
    ready: decisions.length > 0 && playable === decisions.length
  };
}
