export type BotCheckInput = {
  actionsPerMinute?: number;
  repeatedClicks?: number;
  identicalIntervals?: number;
  sessionMinutes?: number;
};

export type BotCheckResult = {
  score: number;
  suspicious: boolean;
  level: "low" | "medium" | "high";
};

export function botCheck(input: BotCheckInput): BotCheckResult {
  const actionsPerMinute = Math.max(0, input.actionsPerMinute ?? 0);
  const repeatedClicks = Math.max(0, input.repeatedClicks ?? 0);
  const identicalIntervals = Math.max(0, input.identicalIntervals ?? 0);
  const sessionMinutes = Math.max(0, input.sessionMinutes ?? 0);

  let score = 0;
  score += Math.min(0.4, actionsPerMinute / 300);
  score += Math.min(0.25, repeatedClicks * 0.03);
  score += Math.min(0.25, identicalIntervals * 0.04);
  score += sessionMinutes > 180 ? 0.1 : 0;

  const normalized = Math.max(0, Math.min(1, Number(score.toFixed(4))));
  const level =
    normalized >= 0.8 ? "high" :
    normalized >= 0.5 ? "medium" :
    "low";

  return {
    score: normalized,
    suspicious: normalized >= 0.5,
    level,
  };
}
