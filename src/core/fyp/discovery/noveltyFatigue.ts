export type NoveltyFatigueState = {
  userId: string;
  recentNoveltyAverage: number;
  fatigueRisk: boolean;
  recommendation: "continue" | "stabilize" | "cooldown";
};

export function evaluateNoveltyFatigue(input: {
  userId: string;
  recentNoveltyScores: number[];
}): NoveltyFatigueState {
  if (!input.userId.trim()) {
    throw new Error("Novelty fatigue requires userId.");
  }

  const average =
    input.recentNoveltyScores.length === 0
      ? 0
      : input.recentNoveltyScores.reduce((sum, value) => sum + value, 0) /
        input.recentNoveltyScores.length;

  const fatigueRisk = average >= 75;

  return {
    userId: input.userId,
    recentNoveltyAverage: Number(average.toFixed(2)),
    fatigueRisk,
    recommendation: fatigueRisk ? "cooldown" : average >= 55 ? "stabilize" : "continue"
  };
}
