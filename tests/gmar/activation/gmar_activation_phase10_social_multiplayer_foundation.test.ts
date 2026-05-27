import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  DEFAULT_GMAR_SOCIAL_STATE,
  createGmarSquad,
  joinGmarSquad,
  createLeaderboardEntry,
  assertGmarSocialState
} from "@/src/core/gmar/social-active/socialMultiplayer";

describe("GMAR Activation Phase 10 — Social + Multiplayer Foundation", () => {
  it("locks default social state", () => {
    expect(DEFAULT_GMAR_SOCIAL_STATE.liveRoomEnabled).toBe(true);
    expect(DEFAULT_GMAR_SOCIAL_STATE.squads).toEqual([]);
  });

  it("creates and joins squad", () => {
    const squad = createGmarSquad({
      squadId: "alpha_squad",
      name: "Alpha Squad",
      ownerPlayerId: "gmar_user_001"
    });

    const updated = joinGmarSquad({
      squad,
      playerId: "gmar_user_002"
    });

    expect(updated.members).toHaveLength(2);
    expect(updated.members.includes("gmar_user_002")).toBe(true);
  });

  it("creates leaderboard entry", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const leaderboard = createLeaderboardEntry({
      state,
      rank: 1
    });

    const squad = createGmarSquad({
      squadId: "origin_team",
      name: "Origin Team",
      ownerPlayerId: "gmar_user_001"
    });

    expect(leaderboard.playerId).toBe("gmar_user_001");
    expect(leaderboard.rank).toBe(1);

    expect(
      assertGmarSocialState({
        squad,
        leaderboard
      })
    ).toBe(true);
  });

  it("rejects duplicate squad join", () => {
    const squad = createGmarSquad({
      squadId: "alpha_squad",
      name: "Alpha Squad",
      ownerPlayerId: "gmar_user_001"
    });

    expect(() =>
      joinGmarSquad({
        squad,
        playerId: "gmar_user_001"
      })
    ).toThrow("GMAR player already in squad.");
  });
});
