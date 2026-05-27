import { describe, expect, it } from "vitest";

import { resolveMeshCapability } from "../../src/core/lumexa/mesh/symbioticMesh";

describe("Lumexa Symbiotic Mesh", () => {
  it("supports tier1", () => {
    expect(
      resolveMeshCapability({
        id: "live",
        tier: "tier1"
      })
    ).toBe(1);
  });

  it("supports tier3 degradation", () => {
    expect(
      resolveMeshCapability({
        id: "external",
        tier: "tier3"
      })
    ).toBeLessThan(0.3);
  });
});
