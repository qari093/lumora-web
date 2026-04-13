import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateRewardsNotificationsBaselineVerification } from "@/lib/softlaunch/rewardsNotificationsBaselineVerification";

describe("soft-launch rewards + notifications baseline verification", () => {
  it("passes valid baseline set", () => {
    const records = JSON.parse(fs.readFileSync("data/softlaunch/rewards-notifications-baseline.json", "utf8"));
    const out = evaluateRewardsNotificationsBaselineVerification({ records });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.rewardReady).toBe(3);
      expect(out.verification.notificationReady).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate user id", () => {
    const out = evaluateRewardsNotificationsBaselineVerification({
      records: [
        { userId: "u1", rewardEngineReady: true, notificationReady: true, unreadCount: 0, rewardBalance: 1 },
        { userId: "u1", rewardEngineReady: true, notificationReady: true, unreadCount: 1, rewardBalance: 2 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_user_id" });
  });

  it("rejects invalid unread count", () => {
    const out = evaluateRewardsNotificationsBaselineVerification({
      records: [
        { userId: "u1", rewardEngineReady: true, notificationReady: true, unreadCount: -1, rewardBalance: 1 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_unread_count" });
  });

  it("rejects invalid reward balance", () => {
    const out = evaluateRewardsNotificationsBaselineVerification({
      records: [
        { userId: "u1", rewardEngineReady: true, notificationReady: true, unreadCount: 0, rewardBalance: -1 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_reward_balance" });
  });
});
