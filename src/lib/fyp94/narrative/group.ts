import type { Fyp94NarrativeClip } from "./types";

export function groupFyp94ClipsByCategory(
  clips: Fyp94NarrativeClip[],
): Record<string, Fyp94NarrativeClip[]> {
  return clips.reduce<Record<string, Fyp94NarrativeClip[]>>((acc, clip) => {
    acc[clip.category] ||= [];
    acc[clip.category].push(clip);
    return acc;
  }, {});
}
