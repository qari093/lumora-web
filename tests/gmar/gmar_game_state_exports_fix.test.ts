import { describe, expect, it } from "vitest";
import {
  assertGmarGameState,
  createInitialGmarGameState
} from "@/src/core/gmar/state/gameState";

describe("GMAR gameState compatibility exports", () => {
  it("creates and asserts initial GMAR game state", () => {
    const state = createInitialGmarGameState("user-1");

    expect(state.userId).toBe("user-1");
    expect(state.status).toBe("initialized");
    expect(state.version).toBe(1);
    expect(() => assertGmarGameState(state)).not.toThrow();
  });

  it("rejects invalid state", () => {
    expect(() => assertGmarGameState({})).toThrow("invalid_gmar_game_state");
  });
});
