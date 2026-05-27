export type HeartfirePulseQuest = {
  id: string;
  constellationId: string;
  title: string;
  targetMinutes: number;
  currentMinutes: number;
  completed: boolean;
};

export function progressQuest(quest: HeartfirePulseQuest, minutes: number): HeartfirePulseQuest {
  const currentMinutes = Math.max(0, quest.currentMinutes + Math.max(0, minutes));
  return {
    ...quest,
    currentMinutes,
    completed: currentMinutes >= quest.targetMinutes,
  };
}
