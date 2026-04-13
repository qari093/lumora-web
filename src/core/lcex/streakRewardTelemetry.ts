export type StreakRewardTelemetryEvent =
  | "streak_started"
  | "streak_preserved"
  | "streak_decayed"
  | "streak_reset"
  | "streak_reward_granted"
  | "streak_reward_blocked"
  | "streak_reward_cooldown"
  | "streak_abuse_blocked";

export type StreakRewardTelemetryRecord = {
  userId: string;
  event: StreakRewardTelemetryEvent;
  streakDays?: number;
  rewardTier?: number;
  occurredAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function buildStreakRewardTelemetryRecord(
  input: StreakRewardTelemetryRecord
): StreakRewardTelemetryRecord {
  return {
    ...input,
    userId: input.userId.trim(),
    region: input.region?.trim().toLowerCase(),
    language: input.language?.trim().toLowerCase(),
    streakDays:
      typeof input.streakDays === "number"
        ? Math.max(0, Math.round(input.streakDays))
        : undefined,
    rewardTier:
      typeof input.rewardTier === "number"
        ? Math.max(0, Math.round(input.rewardTier))
        : undefined,
  };
}

export function getStreakRewardTelemetryKey(
  record: StreakRewardTelemetryRecord
): string {
  return [
    record.userId,
    record.event,
    String(record.streakDays ?? "none"),
    String(record.rewardTier ?? "none"),
    record.region || "global",
    record.occurredAt,
  ].join(":");
}
