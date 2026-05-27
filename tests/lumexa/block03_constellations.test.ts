import { describe, expect, it } from "vitest";

import {
  generateScentTrailStrength,
  rankPortalConstellations
} from "../../src/core/lumexa/constellation/portalConstellations";

describe("Lumexa Portal Constellations", () => {
  it("sorts portals by priority", () => {
    const result = rankPortalConstellations([
      { id: "echo", priority: 0.2, glow: 0.2 },
      { id: "live", priority: 0.9, glow: 0.9 }
    ]);

    expect(result[0].id).toBe("live");
  });

  it("creates scent trail strength", () => {
    expect(generateScentTrailStrength(0.9)).toBeGreaterThan(0.5);
  });
});
