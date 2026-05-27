import {
  createInitialGmarGameState,
  assertGmarGameState
} from "@/src/core/gmar/state/gameState";

describe("GMAR Activation Phase 04 — Real Game State", () => {
  it("creates initial GMAR game state", () => {
    const state = createInitialGmarGameState({
      userId: "user_001",
      displayName: "Waqar",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(state.player.playerId).toBe("gmar_user_001");

    expect(state.inventory[0]?.itemId).toBe(
      "starter_pulse_blade"
    );

    expect(state.inventory[0]?.equipped).toBe(true);

    expect(state.missions[0]?.missionId).toBe(
      "first_signal"
    );

    expect(state.missions[0]?.completed).toBe(false);

    expect(state.rewards).toEqual([]);

    expect(state.world.worldId).toBe(
      "gmar_origin_realm"
    );

    expect(state.world.zoneId).toBe(
      "arrival_gate"
    );

    expect(assertGmarGameState(state)).toBe(true);
  });

  it("rejects invalid player input", () => {
    expect(() =>
      createInitialGmarGameState({
        userId: " "
      })
    ).toThrow("GMAR player userId is required.");
  });
});
