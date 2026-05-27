import { describe, expect, it } from "vitest";
import { movementRuntime, movementHealthy } from "../../src/core/nexa/movement/movementRuntime";
import { fitnessRuntime, fitnessHealthy } from "../../src/core/nexa/fitness/fitnessRuntime";

describe("NEXA Pack 02/12 — Movement + Fitness", () => {
  it("supports movement systems", () => {
    expect(movementRuntime.dailySculpture).toBe(true);
    expect(movementRuntime.movementSeasonality).toBe(true);
    expect(movementHealthy()).toBe(true);
  });

  it("supports fitness systems", () => {
    expect(fitnessRuntime.strengthTraining).toBe(true);
    expect(fitnessRuntime.sportProtocols).toBe(true);
    expect(fitnessRuntime.audioCuedTraining).toBe(true);
    expect(fitnessHealthy()).toBe(true);
  });
});
