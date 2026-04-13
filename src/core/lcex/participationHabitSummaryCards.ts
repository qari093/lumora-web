export type ParticipationHabitSummaryInput = {
  habitId: string;
  title: string;
  currentCount: number;
  targetCount: number;
  completed: boolean;
  updatedAt: string;
};

export type ParticipationHabitSummaryCard = {
  id: string;
  type: "participation-habit-summary";
  habitId: string;
  title: string;
  subtitle: string;
  statsLine: string;
  updatedAt: string;
};

export function buildParticipationHabitSummaryCard(
  input: ParticipationHabitSummaryInput
): ParticipationHabitSummaryCard {
  const currentCount = Math.max(0, Math.round(input.currentCount));
  const targetCount = Math.max(1, Math.round(input.targetCount));

  return {
    id: `participation-habit-summary:${input.habitId.trim()}`,
    type: "participation-habit-summary",
    habitId: input.habitId.trim(),
    title: input.title.trim(),
    subtitle: input.completed ? "Habit completed" : "Habit in progress",
    statsLine: `${currentCount}/${targetCount} progress`,
    updatedAt: input.updatedAt,
  };
}

export function isParticipationHabitSummaryCardUsable(
  card: ParticipationHabitSummaryCard
): boolean {
  return (
    card.habitId.length > 0 &&
    card.title.length > 0 &&
    card.subtitle.length > 0 &&
    card.statsLine.length > 0
  );
}
