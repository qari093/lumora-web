import type {
  RetentionProfile,
  RetentionSignal
} from "../types";

export function buildRetentionProfile(
  userId: string,
  signals: RetentionSignal[]
): RetentionProfile {
  const score = signals.reduce(
    (sum, signal) => sum + signal.weight,
    0
  );

  const streak = signals.length;

  const level =
    score >= 20
      ? "hot"
      : score >= 10
      ? "warm"
      : "cold";

  return {
    userId,
    score,
    streak,
    level
  };
}
