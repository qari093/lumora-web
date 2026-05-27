import type { Fyp94NarrativeSequence } from "./types";

export function activateFyp94Sequence(sequence: Fyp94NarrativeSequence): Fyp94NarrativeSequence {
  return { ...sequence, state: "active" };
}

export function abandonFyp94Sequence(sequence: Fyp94NarrativeSequence): Fyp94NarrativeSequence {
  return { ...sequence, state: "abandoned" };
}

export function completeFyp94Sequence(sequence: Fyp94NarrativeSequence): Fyp94NarrativeSequence {
  return { ...sequence, state: "completed" };
}

export function resetAbandonedFyp94Sequence(sequence: Fyp94NarrativeSequence): Fyp94NarrativeSequence {
  if (sequence.state !== "abandoned") return sequence;
  return { ...sequence, state: "ready" };
}
