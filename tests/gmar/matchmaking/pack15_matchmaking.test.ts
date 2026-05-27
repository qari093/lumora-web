import { describe, expect, it } from "vitest";
import { matchmakingHealthy } from "../../../src/core/gmar/matchmaking/runtime";
import { civilizationMatchingHealthy } from "../../../src/core/gmar/matchmaking/civilization";

describe("GMAR Mega Pack 15 — Matchmaking", () => {
  it("validates matchmaking runtime", () => {
    const runtime = matchmakingHealthy();

    expect(runtime.fairMatching).toBe(true);
    expect(runtime.skillBalanced).toBe(true);
  });

  it("validates civilization matching", () => {
    const civ = civilizationMatchingHealthy();

    expect(civ.emotionalCompatibility).toBe(true);
    expect(civ.toxicityProtected).toBe(true);
  });
});
