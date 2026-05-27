import { describe, expect, it } from "vitest";
import { nutritionRuntime, nutritionHealthy } from "../../src/core/nexa/nutrition/nutritionRuntime";
import { recoveryRuntime, recoveryHealthy } from "../../src/core/nexa/recovery/recoveryRuntime";

describe("NEXA Pack 03/12 — Nutrition + Recovery", () => {
  it("supports nutrition systems", () => {
    expect(nutritionRuntime.oneTapMoodPlate).toBe(true);
    expect(nutritionRuntime.culinaryWhisper).toBe(true);
    expect(nutritionRuntime.hydrationRing).toBe(true);
    expect(nutritionHealthy()).toBe(true);
  });

  it("supports recovery systems", () => {
    expect(recoveryRuntime.sleepScoring).toBe(true);
    expect(recoveryRuntime.echoWindDown).toBe(true);
    expect(recoveryRuntime.quietCheckIn).toBe(true);
    expect(recoveryHealthy()).toBe(true);
  });
});
