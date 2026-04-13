export type ParticipationHabitStatus =
  | "draft"
  | "active"
  | "cooldown"
  | "archived";

export type ParticipationHabitCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media"
  | "system";

export type ParticipationHabitRecord = {
  id: string;
  title: string;
  category: ParticipationHabitCategory;
  triggerType:
    | "daily-visit"
    | "reaction"
    | "prediction"
    | "live-room"
    | "mood-board"
    | "badge-progress";
  status: ParticipationHabitStatus;
  targetCount: number;
  createdAt: string;
  updatedAt: string;
};

export const PARTICIPATION_HABIT_REGISTRY: ParticipationHabitRecord[] = [];

export function registerParticipationHabit(
  habit: ParticipationHabitRecord
): void {
  PARTICIPATION_HABIT_REGISTRY.push({
    ...habit,
    id: habit.id.trim(),
    title: habit.title.trim(),
    targetCount: Math.max(1, Math.round(habit.targetCount)),
  });
}

export function getParticipationHabitById(
  id: string
): ParticipationHabitRecord | undefined {
  const normalizedId = id.trim();
  return PARTICIPATION_HABIT_REGISTRY.find((habit) => habit.id === normalizedId);
}

export function getActiveParticipationHabits(): ParticipationHabitRecord[] {
  return PARTICIPATION_HABIT_REGISTRY
    .filter((habit) => habit.status === "active")
    .sort((a, b) => {
      const aTs = Date.parse(a.updatedAt);
      const bTs = Date.parse(b.updatedAt);
      return (Number.isNaN(bTs) ? 0 : bTs) - (Number.isNaN(aTs) ? 0 : aTs);
    });
}
