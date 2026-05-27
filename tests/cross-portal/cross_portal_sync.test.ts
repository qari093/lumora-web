import { describe, expect, it } from "vitest";
import { crossPortalSession } from "@/src/core/cross-portal/session/crossPortalSession";
import { sharedAtmosphere } from "@/src/core/cross-portal/atmosphere/sharedAtmosphere";
import { continuityValidator } from "@/src/core/cross-portal/continuity/continuityValidator";

describe("cross portal synchronization", () => {
  it("preserves cross portal session", () => {
    expect(crossPortalSession("fyp", "live").preserved).toBe(true);
  });

  it("keeps atmosphere non-fragmented", () => {
    expect(sharedAtmosphere.nonFragmented).toBe(true);
  });

  it("validates continuity", () => {
    expect(continuityValidator().continuity).toBe(true);
  });
});
