import { describe, expect, it } from "vitest";
import {
  assertGmarGameState,
  createInitialGmarGameState,
} from "@/src/core/gmar/state/gameState";

describe("GMAR state input normalizer", () => {
  it("accepts string user identity input", () => {
    const state = createInitialGmarGameState(" user-1 ");
    expect(state.player.userId).toBe("user-1");
    expect(state.player.playerId).toBe("gmar_user-1");
    expect(assertGmarGameState(state)).toBeTypeOf("boolean");
  });

  it("accepts canonical object input", () => {
    const state = createInitialGmarGameState({
      userId: "player-1",
      displayName: "Player One",
    });
    expect(state.player.userId).toBe("player-1");
    expect(state.player.playerId).toBe("gmar_player-1");
    expect(state.player.displayName).toBe("Player One");
    expect(assertGmarGameState(state)).toBeTypeOf("boolean");
  });

  it("normalizes surrounding whitespace from canonical user id", () => {
    const state = createInitialGmarGameState({
      userId: " nested-1 ",
      displayName: "Nested",
    });
    expect(state.player.userId).toBe("nested-1");
    expect(state.player.playerId).toBe("gmar_nested-1");
    expect(assertGmarGameState(state)).toBeTypeOf("boolean");
  });
});
