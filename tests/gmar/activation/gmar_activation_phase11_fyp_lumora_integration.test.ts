import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  createGmarFypActivityCard,
  createGmarAchievementSurface,
  assertGmarFypActivityCard
} from "@/src/core/gmar/fyp-active/gmarFypBridge";

describe("GMAR Activation Phase 11 — FYP/Lumora Integration", () => {
  it("creates GMAR FYP activity card", () => {
    const state = createInitialGmarGameState({
      userId: "user_001",
      displayName: "Waqar"
    });

    const card = createGmarFypActivityCard({
      state,
      type: "event_joined",
      title: "Origin Storm Joined",
      description: "Waqar entered the Origin Storm event.",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(card.playerId).toBe("gmar_user_001");
    expect(card.type).toBe("event_joined");
    expect(card.route).toBe("/gmar");
    expect(card.shareable).toBe(true);
    expect(assertGmarFypActivityCard(card)).toBe(true);
  });

  it("creates achievement surface card", () => {
    const state = createInitialGmarGameState({
      userId: "user_001",
      displayName: "Waqar"
    });

    const card = createGmarAchievementSurface({
      state,
      achievementTitle: "First Signal Stabilized",
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(card.type).toBe("mission_completed");
    expect(card.title).toBe("First Signal Stabilized");
    expect(card.description).toContain("Waqar");
    expect(assertGmarFypActivityCard(card)).toBe(true);
  });

  it("rejects empty title", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      createGmarFypActivityCard({
        state,
        type: "reward_claimed",
        title: " ",
        description: "Reward claimed."
      })
    ).toThrow("GMAR FYP activity title and description are required.");
  });
});
