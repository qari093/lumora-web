import { describe, expect, it } from "vitest";

import {
  validateEchoSeed,
  validateMorningPortal,
  validateRitualRuntime
} from "@/src/core/lumaspace/rituals/contracts/ritualContract";

import {
  createMorningPortal
} from "@/src/core/lumaspace/rituals/runtime/morningPortal";

import {
  runRitualRuntime
} from "@/src/core/lumaspace/rituals/runtime/ritualRuntime";

describe("LumaSpace Daily Rituals Activation", () => {
  it("validates echo seed", () => {
    expect(
      validateEchoSeed({
        id: "seed_001",
        mood: "calm"
      })
    ).toBe(true);
  });

  it("creates morning portal", () => {
    expect(
      validateMorningPortal(createMorningPortal())
    ).toBe(true);
  });

  it("runs ritual runtime", () => {
    expect(
      validateRitualRuntime(runRitualRuntime())
    ).toBe(true);
  });
});
