import { describe, expect, it } from "vitest";
import { aiOrchestratorHealthy } from "../../../src/core/gmar/ai/orchestrator";
import { worldDirectorHealthy } from "../../../src/core/gmar/ai/worldDirector";

describe("GMAR Mega Pack 18 — AI Orchestration", () => {
  it("validates AI orchestrator", () => {
    const ai = aiOrchestratorHealthy();

    expect(ai.emotionalSafety).toBe(true);
    expect(ai.noManipulativeTargeting).toBe(true);
  });

  it("validates world director", () => {
    const director = worldDirectorHealthy();

    expect(director.civilizationAware).toBe(true);
    expect(director.playerAgencyProtected).toBe(true);
  });
});
