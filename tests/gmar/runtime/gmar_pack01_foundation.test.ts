import { describe, it, expect } from "vitest";

import { GameplayRuntime } from "../../../src/core/gmar/runtime/gameplayRuntime";
import { createInitialState } from "../../../src/core/gmar/state/gameState";
import { detectCollision } from "../../../src/core/gmar/physics/collision";
import { difficultyMultiplier } from "../../../src/core/gmar/ai/difficultyScaling";
import { performAttack } from "../../../src/core/gmar/combat/combatRuntime";

describe("GMAR PACK 1", () => {
  it("boots gameplay runtime", () => {
    const runtime = new GameplayRuntime();

    runtime.start();

    expect(runtime.status().running).toBe(true);
  });

  it("creates initial state", () => {
    const state = createInitialState("player-1");

    expect(state.player.level).toBe(1);
  });

  it("detects collision", () => {
    const hit = detectCollision(
      { x: 0, y: 0, r: 10 },
      { x: 5, y: 5, r: 10 }
    );

    expect(hit).toBe(true);
  });

  it("scales difficulty", () => {
    expect(difficultyMultiplier(10)).toBeGreaterThan(1);
  });

  it("runs combat", () => {
    const result = performAttack(60);

    expect(result.critical).toBe(true);
  });
});
