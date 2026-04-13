import { describe, expect, it } from "vitest";
import {
  summarizeEngagement,
  validateEngagementEvent
} from "../../lib/engagement/tracking";

describe("engagement tracking", () => {
  const now = Date.now();

  it("summarizes engagement metrics correctly", () => {
    const summary = summarizeEngagement("item_1", [
      { itemId: "item_1", userId: "u1", type: "view", timestamp: now },
      { itemId: "item_1", userId: "u1", type: "like", timestamp: now + 1 },
      { itemId: "item_1", userId: "u1", type: "watch_progress", timestamp: now + 2, watchMs: 1200 },
      { itemId: "item_1", userId: "u1", type: "complete", timestamp: now + 3, watchMs: 3000 },
      { itemId: "item_1", userId: "u2", type: "view", timestamp: now + 4 },
      { itemId: "item_1", userId: "u2", type: "skip", timestamp: now + 5 }
    ]);

    expect(summary.views).toBe(2);
    expect(summary.likes).toBe(1);
    expect(summary.skips).toBe(1);
    expect(summary.completes).toBe(1);
    expect(summary.totalWatchMs).toBe(4200);
    expect(summary.averageWatchMs).toBe(2100);
    expect(summary.completionRate).toBe(0.5);
  });

  it("ignores unrelated items", () => {
    const summary = summarizeEngagement("item_1", [
      { itemId: "item_2", userId: "u1", type: "view", timestamp: now }
    ]);

    expect(summary.views).toBe(0);
    expect(summary.totalWatchMs).toBe(0);
  });

  it("validates correct events", () => {
    expect(
      validateEngagementEvent({
        itemId: "item_1",
        userId: "u1",
        type: "watch_progress",
        timestamp: now,
        watchMs: 100
      })
    ).toBe(true);
  });

  it("rejects invalid watch events", () => {
    expect(
      validateEngagementEvent({
        itemId: "item_1",
        userId: "u1",
        type: "watch_progress",
        timestamp: now,
        watchMs: -5
      })
    ).toBe(false);
  });
});
