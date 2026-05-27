import type { Fyp94NarrativeClip, Fyp94NarrativeSequence } from "./types";

export function detectFyp94PayoffCandidate(clips: Fyp94NarrativeClip[]): Fyp94NarrativeClip | null {
  if (!clips.length) return null;
  return [...clips].sort((a, b) => b.thrillScore - a.thrillScore)[0] ?? null;
}

export function buildFyp94NarrativeSequence(
  category: string,
  clips: Fyp94NarrativeClip[],
): Fyp94NarrativeSequence | null {
  if (clips.length < 3) return null;

  const ordered = [...clips].sort((a, b) => a.thrillScore - b.thrillScore);
  const setup = ordered[0];
  const tension = ordered[Math.floor(ordered.length / 2)];
  const payoff = ordered[ordered.length - 1];

  if (!setup || !tension || !payoff) return null;

  return {
    sequenceId: `seq_${category}_${setup.id}_${payoff.id}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    category,
    setup,
    tension,
    payoff,
    state: "ready",
  };
}
