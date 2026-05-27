import { describe, expect, it } from "vitest";

import {
  createGutCheckSession
} from "@/src/core/fyp/gutcheck/gutCheckBuilder";

import {
  finalizeGutCheck
} from "@/src/core/fyp/gutcheck/gutReaction";

import {
  createDailyRitual
} from "@/src/core/fyp/ritual/dailyRitual";

import {
  calculateStreakProtection
} from "@/src/core/fyp/ritual/streakProtection";

import {
  createGutCheckShareCard
} from "@/src/core/fyp/ritual/shareCard";

describe("Lumora FYP Gut Check + Daily Ritual", () => {
  const items = [
    {
      id: "a",
      creatorId: "c1",
      mode: "chaos" as const,
      intensity: 9,
      replayWeight: 20,
      novelty: 70,
      createdAt: 1
    },
    {
      id: "b",
      creatorId: "c2",
      mode: "deep" as const,
      intensity: 7,
      replayWeight: 18,
      novelty: 60,
      createdAt: 2
    },
    {
      id: "c",
      creatorId: "c3",
      mode: "wonder" as const,
      intensity: 8,
      replayWeight: 14,
      novelty: 80,
      createdAt: 3
    },
    {
      id: "d",
      creatorId: "c4",
      mode: "comfort" as const,
      intensity: 6,
      replayWeight: 10,
      novelty: 40,
      createdAt: 4
    }
  ];

  it("creates gut check session", () => {
    const session =
      createGutCheckSession({
        userId: "waqar",
        candidates: items,
        now: 100
      });

    expect(session.clips).toHaveLength(4);
    expect(session.expiresAt).toBe(60100);
  });

  it("finalizes gut check result", () => {
    const session =
      createGutCheckSession({
        userId: "waqar",
        candidates: items,
        now: 100
      });

    const result = finalizeGutCheck({
      session,
      strongestClipId: "a"
    });

    expect(result.dominantMode).toBe("chaos");
    expect(result.shareCardReady).toBe(true);
  });

  it("creates daily ritual state", () => {
    const ritual =
      createDailyRitual({
        userId: "waqar",
        streak: 5,
        completedToday: true
      });

    expect(ritual.rewardUnlocked).toBe(true);
  });

  it("protects long streak", () => {
    const protection =
      calculateStreakProtection({
        streak: 10,
        missedHours: 8
      });

    expect(protection.protected).toBe(true);
  });

  it("creates gut check share card", () => {
    const card =
      createGutCheckShareCard({
        dominantMode: "deep",
        emotionalSignature: "deep_surge",
        adrenalineIndex: 88,
        shareCardReady: true
      });

    expect(card.shareReady).toBe(true);
    expect(card.title).toContain("Gut Check");
  });
});
