import { describe, expect, it } from "vitest";

import {
  createNeutralAtmosphere,
  resolveAtmosphereMode,
  evolveAtmosphere
} from "@/src/core/lumexa/atmosphere/atmosphereCore";

describe("Lumexa Atmospheric Core", () => {
  it("creates neutral atmosphere", () => {
    const state = createNeutralAtmosphere();

    expect(state.mode).toBe("neutral");
    expect(state.energy).toBe(0.5);
    expect(state.inward).toBe(0.5);
  });

  it("resolves calm mode", () => {
    expect(resolveAtmosphereMode(0.2, 0.9)).toBe("calm");
  });

  it("evolves atmosphere", () => {
    const state = evolveAtmosphere(createNeutralAtmosphere(), 0.2, 0.9);

    expect(state.mode).toBe("calm");
    expect(state.confidence).toBeGreaterThanOrEqual(0.72);
  });
});
