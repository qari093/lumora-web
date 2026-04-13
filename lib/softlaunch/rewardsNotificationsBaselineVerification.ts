export type RewardNotificationRecord = {
  userId: string;
  rewardEngineReady: boolean;
  notificationReady: boolean;
  unreadCount: number;
  rewardBalance: number;
};

export type RewardsNotificationsBaselineVerificationInput = {
  records?: RewardNotificationRecord[] | null;
};

export type RewardsNotificationsBaselineVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        rewardReady: number;
        notificationReady: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateRewardsNotificationsBaselineVerification(
  input: RewardsNotificationsBaselineVerificationInput
): RewardsNotificationsBaselineVerificationResult {
  const records = Array.isArray(input.records) ? input.records : [];
  if (records.length === 0) return { ok: false, reason: "missing_records" };

  const userIds = new Set<string>();
  let rewardReady = 0;
  let notificationReady = 0;

  for (const record of records) {
    if (!record.userId?.trim()) return { ok: false, reason: "missing_user_id" };
    if (userIds.has(record.userId)) return { ok: false, reason: "duplicate_user_id" };
    userIds.add(record.userId);

    if (!Number.isFinite(record.unreadCount) || record.unreadCount < 0) {
      return { ok: false, reason: "invalid_unread_count" };
    }
    if (!Number.isFinite(record.rewardBalance) || record.rewardBalance < 0) {
      return { ok: false, reason: "invalid_reward_balance" };
    }

    if (record.rewardEngineReady) rewardReady += 1;
    if (record.notificationReady) notificationReady += 1;
  }

  return {
    ok: true,
    verification: {
      total: records.length,
      rewardReady,
      notificationReady,
      ready: rewardReady === records.length && notificationReady === records.length,
    },
  };
}
