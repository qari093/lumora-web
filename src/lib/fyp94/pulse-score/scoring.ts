import type { Fyp94PulseScoreEvent, Fyp94PulseScoreState } from "./types";
import { updateFyp94DailyStreak } from "./streak";

export function applyFyp94PulseScoreEvent(
  state: Fyp94PulseScoreState,
  event: Fyp94PulseScoreEvent,
  now = new Date(),
): Fyp94PulseScoreState {
  if (event.type === "daily_active") {
    return updateFyp94DailyStreak(state, event.date, now);
  }

  const points =
    event.points ??
    (event.type === "full_watch" ? 3 : event.type === "sequence_completed" ? 10 : 0);

  return {
    ...state,
    score: Math.max(0, state.score + points),
    updatedAt: now.toISOString(),
  };
}
