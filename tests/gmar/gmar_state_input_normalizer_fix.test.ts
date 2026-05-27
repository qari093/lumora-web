import { describe, expect, it } from "vitest";
import {
  assertGmarGameState,
  createInitialGmarGameState
} from "@/src/core/gmar/state/gameState";

describe("GMAR state input normalizer", () => {
  it("accepts string input", () => {
    const state = createInitialGmarGameState(" user-1 ");
    expect(state.playerId).toBe("user-1");
    expect(state.player.playerId).toBe("user-1");
    expect(() => assertGmarGameState(state)).not.toThrow();
  });

  it("accepts object input with playerId", () => {
    const state = createInitialGmarGameState({ playerId: "player-1" });
    expect(state.playerId).toBe("player-1");
    expect(state.player.playerId).toBe("player-1");
    expect(() => assertGmarGameState(state)).not.toThrow();
  });

  it("accepts nested player object input", () => {
    const state = createInitialGmarGameState({ player: { playerId: "nested-1" } });
    expect(state.playerId).toBe("nested-1");
    expect(state.player.playerId).toBe("nested-1");
    expect(() => assertGmarGameState(state)).not.toThrow();
  });
});
