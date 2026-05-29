import { describe, expect, it } from "vitest";
import { createBetaKeystone } from "@/lib/beta/betaKeystone";

describe("beta keystone", () => {
  it("creates permanent founding artifact", () => {
    const artifact = createBetaKeystone("waqar");
    expect(artifact.permanent).toBe(true);
    expect(artifact.artifact).toBe("FOUNDING_PRESENCE");
    expect(artifact.emotionalLegacy.length).toBeGreaterThan(1);
  });
});
