import type { Fyp94PulseScoreState } from "./types";

function dayMs() {
  return 24 * 60 * 60 * 1000;
}

export function createFyp94PulseScoreState(input: {
  anonymousUserId: string;
  now?: Date;
}): Fyp94PulseScoreState {
  const now = input.now ?? new Date();
  return {
    anonymousUserId: input.anonymousUserId,
    streakDays: 0,
    score: 0,
    lastActiveDate: now.toISOString().slice(0, 10),
    updatedAt: now.toISOString(),
  };
}

export function updateFyp94DailyStreak(
  state: Fyp94PulseScoreState,
  activeDate: string,
  now = new Date(),
): Fyp94PulseScoreState {
  const last = new Date(`${state.lastActiveDate}T00:00:00.000Z`).getTime();
  const current = new Date(`${activeDate}T00:00:00.000Z`).getTime();
  const diffDays = Math.round((current - last) / dayMs());

  if (activeDate === state.lastActiveDate) {
    return { ...state, updatedAt: now.toISOString() };
  }

  return {
    ...state,
    streakDays: diffDays === 1 ? state.streakDays + 1 : 1,
    lastActiveDate: activeDate,
    updatedAt: now.toISOString(),
  };
}
