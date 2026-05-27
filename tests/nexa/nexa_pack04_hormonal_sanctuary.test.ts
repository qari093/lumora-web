import { describe, expect, it } from "vitest";
import { hormonalRuntime, hormonalHealthy } from "../../src/core/nexa/hormonal/hormonalRuntime";
import { sanctuaryRuntime, sanctuaryHealthy } from "../../src/core/nexa/sanctuary/sanctuaryRuntime";

describe("NEXA Pack 04/12 — Hormonal + Sanctuary", () => {
  it("supports hormonal and pelvic health systems", () => {
    expect(hormonalRuntime.cycleSeasons).toBe(true);
    expect(hormonalRuntime.kegelProgression).toBe(true);
    expect(hormonalRuntime.deepCorePulse).toBe(true);
    expect(hormonalHealthy()).toBe(true);
  });

  it("supports sanctuary systems", () => {
    expect(sanctuaryRuntime.eternalFlame).toBe(true);
    expect(sanctuaryRuntime.totems).toBe(true);
    expect(sanctuaryRuntime.noComparisonEnforcement).toBe(true);
    expect(sanctuaryHealthy()).toBe(true);
  });
});
