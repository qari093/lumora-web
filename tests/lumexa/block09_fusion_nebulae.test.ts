import { describe, expect, it } from "vitest";

import { createFusionNebula } from "../../src/core/lumexa/fusions/fusionNebulae";

describe("Lumexa Fusion Nebulae", () => {
  it("creates fusion nebula", () => {
    const result = createFusionNebula(["gmar", "echo"]);

    expect(result.atmosphere).toBe("focus_sanctuary");
  });

  it("creates stable fusion", () => {
    const result = createFusionNebula(["live", "music"]);

    expect(result.stability).toBeGreaterThan(0.8);
  });
});
