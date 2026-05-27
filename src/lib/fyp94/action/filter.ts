import { calculateFyp94ThrillScore, type Fyp94ThrillInput } from "./thrillScore";

export type Fyp94ScoredClip<T extends Fyp94ThrillInput = Fyp94ThrillInput> = T & {
  thrillScore: number;
};

export function scoreFyp94Clips<T extends Fyp94ThrillInput>(clips: T[]): Fyp94ScoredClip<T>[] {
  return clips.map((clip) => ({
    ...clip,
    thrillScore: calculateFyp94ThrillScore(clip),
  }));
}

export function filterLowFyp94ThrillClips<T extends Fyp94ThrillInput>(
  clips: T[],
  threshold = 45,
): Fyp94ScoredClip<T>[] {
  return scoreFyp94Clips(clips).filter((clip) => clip.thrillScore >= threshold);
}

export function promoteHighFyp94ThrillPool<T extends Fyp94ThrillInput>(
  clips: T[],
  keepRatio = 0.3,
): Fyp94ScoredClip<T>[] {
  const scored = scoreFyp94Clips(clips).sort((a, b) => b.thrillScore - a.thrillScore);
  const keep = Math.max(1, Math.ceil(scored.length * keepRatio));
  return scored.slice(0, keep);
}
