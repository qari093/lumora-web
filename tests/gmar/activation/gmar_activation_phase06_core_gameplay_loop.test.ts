import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  completeGmarObjective,
  assertGmarGameplayCompletion
} from "@/src/core/gmar/gameplay/gameplayLoop";

describe("GMAR Activation Phase 06 — Core Gameplay Loop", () => {
  it("completes first playable objective and grants rewards", () => {
    const state = createInitialGmarGameState({
      userId: "user_001",
      displayName: "Waqar",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    const result = completeGmarObjective({
      state,
      missionId: "first_signal",
      now: new Date("2026-05-09T00:01:00.000Z")
    });

    expect(result.completedMission.completed).toBe(true);
    expect(result.completedMission.rewardClaimed).toBe(true);
    expect(result.state.player.xp).toBe(25);
    expect(result.rewardsGranted).toHaveLength(2);
    expect(result.rewardsGranted[0]?.type).toBe("xp");
    expect(result.rewardsGranted[1]?.type).toBe("zencoin");
    expect(assertGmarGameplayCompletion(result)).toBe(true);
  });

  it("rejects missing mission", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      completeGmarObjective({
        state,
        missionId: "missing"
      })
    ).toThrow("GMAR mission not found.");
  });

  it("rejects duplicate reward claim", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const first = completeGmarObjective({
      state,
      missionId: "first_signal"
    });

    expect(() =>
      completeGmarObjective({
        state: first.state,
        missionId: "first_signal"
      })
    ).toThrow("GMAR mission reward already claimed.");
  });
});
