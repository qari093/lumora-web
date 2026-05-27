export type DailyRitualState = {
  userId: string;
  streak: number;
  completedToday: boolean;
  rewardUnlocked: boolean;
};

export function createDailyRitual(input: {
  userId: string;
  streak: number;
  completedToday: boolean;
}): DailyRitualState {
  if (!input.userId.trim()) {
    throw new Error("Daily ritual requires userId.");
  }

  return {
    userId: input.userId,
    streak: input.streak,
    completedToday: input.completedToday,
    rewardUnlocked:
      input.completedToday &&
      input.streak >= 3
  };
}
