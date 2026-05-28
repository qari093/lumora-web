export type MoodRail = {
  id: string;
  mood: string;
  completionReward: string;
  entries: number;
};

export function createMoodRail(
  mood: string,
  entries: number
): MoodRail {
  return {
    id: `rail-${mood}`,
    mood,
    completionReward: `${mood}-theme`,
    entries
  };
}
