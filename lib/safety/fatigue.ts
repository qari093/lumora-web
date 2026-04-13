export type FatigueInput = {
  sessionMinutes?: number;
  duelsPlayed?: number;
  rapidActions?: number;
  lateNightUsage?: boolean;
};

export type FatigueResult = {
  score: number;
  fatigued: boolean;
  level: "low" | "medium" | "high";
};

export function detectFatigue(input: FatigueInput): FatigueResult {
  const sessionMinutes = Math.max(0, input.sessionMinutes ?? 0);
  const duelsPlayed = Math.max(0, input.duelsPlayed ?? 0);
  const rapidActions = Math.max(0, input.rapidActions ?? 0);
  const lateNightUsage = Boolean(input.lateNightUsage);

  let score = 0;

  score += Math.min(0.35, sessionMinutes / 180);
  score += Math.min(0.30, duelsPlayed * 0.06);
  score += Math.min(0.20, rapidActions * 0.02);
  score += lateNightUsage ? 0.15 : 0;

  const normalized = Math.max(0, Math.min(1, Number(score.toFixed(4))));

  const level =
    normalized >= 0.8 ? "high" :
    normalized >= 0.5 ? "medium" :
    "low";

  return {
    score: normalized,
    fatigued: normalized >= 0.5,
    level,
  };
}
