import { describe, expect, it } from "vitest";
import {
  assertGmarGameState,
  createInitialGmarGameState
} from "@/src/core/gmar/state/gameState";

describe("GMAR nested player compatibility", () => {
  it("creates root and nested playerId", () => {
    const state = createInitialGmarGameState("user-1");

    expect(state.playerId).toBe("user-1");
    expect(state.player.playerId).toBe("gmar_user-1");
    expect(state.player.userId).toBe("user-1");
    expect(() => assertGmarGameState(state)).not.toThrow();
  });

  it("rejects missing nested player", () => {
    expect(() =>
      assertGmarGameState({
        userId: "user-1",
        playerId: "user-1",
        status: "initialized",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        version: 1
      })
    ).toThrow("invalid_gmar_game_state");
  });
});
