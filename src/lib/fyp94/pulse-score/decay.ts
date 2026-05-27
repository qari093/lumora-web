import type { Fyp94PulseScoreState } from "./types";

export function applyFyp94SoftDecay(input: {
  state: Fyp94PulseScoreState;
  inactiveDays: number;
}): Fyp94PulseScoreState {
  if (input.inactiveDays <= 0) return input.state;

  const decay = Math.min(input.state.score, input.inactiveDays * 5);

  return {
    ...input.state,
    score: Math.max(0, input.state.score - decay),
    streakDays: input.inactiveDays >= 2 ? 0 : input.state.streakDays,
  };
}
