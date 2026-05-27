import { describe, expect, it } from "vitest";
import { identityBridge } from "@/src/core/identity/crossPortal/identityBridge";
import { sharedAtmosphere } from "@/src/core/identity/crossPortal/sharedAtmosphere";

describe("cross portal identity", () => {
  it("preserves identity across portals", () => {
    expect(identityBridge("fyp", "live").identityPreserved).toBe(true);
  });

  it("keeps shared atmosphere unified", () => {
    expect(sharedAtmosphere.unified).toBe(true);
  });
});
