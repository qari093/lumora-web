import { describe, expect, it } from "vitest";
import { classifyAdvancedState } from "@/src/monetization/state/classifier";
import { smoothSession } from "@/src/monetization/state/memory";
import { resolveTransition } from "@/src/monetization/state/transitions";
import { computeState } from "@/src/monetization/state/engine";

describe("Monetization Pack02 — State Engine", () => {

  it("classifies advanced states", () => {
    expect(classifyAdvancedState({
      skipRate: 0.8,
      holdRate: 0.1,
      sessionDepth: 1,
      rewatchRate: 0,
      emotionalDrift: 0.8,
    })).toBe("red");

    expect(classifyAdvancedState({
      skipRate: 0.2,
      holdRate: 0.7,
      sessionDepth: 5,
      rewatchRate: 0.2,
      emotionalDrift: 0.2,
    })).toBe("green");
  });

  it("smooths session memory", () => {
    const result = smoothSession(
      [{ skipRate: 0.5, holdRate: 0.5, emotionalDrift: 0.5 }],
      { skipRate: 1, holdRate: 0, emotionalDrift: 1 }
    );

    expect(result.skipRate).toBeGreaterThan(0.5);
  });

  it("prevents unsafe transitions", () => {
    expect(resolveTransition("red", "green")).toBe("yellow");
  });

  it("computes stable state", () => {
    const state = computeState({
      skipRate: 0.2,
      holdRate: 0.6,
      sessionDepth: 5,
      rewatchRate: 0.2,
      emotionalDrift: 0.2,
      history: [],
      previousState: "yellow",
    });

    expect(["green", "yellow"]).toContain(state);
  });

});
