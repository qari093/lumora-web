import { describe, it, expect } from "vitest";
import { createAtmosphereState } from "@/lib/atmosphere/runtime";

describe("atmosphere runtime", () => {
  it("creates atmosphere state", () => {
    const state = createAtmosphereState("COSMIC_DRIFT");
    expect(state.intensity).toBeGreaterThan(0);
  });
});
