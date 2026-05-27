import type { Fyp94PulseScoreState } from "./types";

export function buildFyp94PrivatePulseDisplay(state: Fyp94PulseScoreState): {
  label: string;
  streakLabel: string;
  scoreLabel: string;
} {
  return {
    label: "Your Pulse",
    streakLabel: `${state.streakDays} day streak`,
    scoreLabel: `${state.score} pulse`,
  };
}
