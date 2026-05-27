import { describe, expect, it } from "vitest";
import {
  assertGmarGameState,
  createInitialGmarGameState
} from "@/src/core/gmar/state/gameState";

describe("GMAR gameState playerId compatibility", () => {
  it("creates playerId required by GMAR prerender", () => {
    const state = createInitialGmarGameState("user-1");

    expect(state.userId).toBe("user-1");
    expect(state.playerId).toBe("user-1");
    expect(() => assertGmarGameState(state)).not.toThrow();
  });

  it("rejects missing playerId", () => {
    expect(() =>
      assertGmarGameState({
        userId: "user-1",
        status: "initialized",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        version: 1
      })
    ).toThrow("invalid_gmar_game_state");
  });
});
