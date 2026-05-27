import { describe, expect, it } from "vitest";
import { validateNativeFypVideo } from "../../src/lib/native-fyp/schema";
import { createRightsDeclaration } from "../../src/lib/native-fyp/rights/declaration";
import { getLicenseRule } from "../../src/lib/native-fyp/rights/licenseRegistry";

describe("native fyp pack 002", () => {
  it("validates rights-aware native video schema", () => {
    const result = validateNativeFypVideo({
      id: "v1",
      title: "Native clip",
      sourceType: "creator_upload",
      rightsStatus: "verified",
      licenseType: "creator_grant",
      playbackUrl: "https://cdn.lumora.local/v1.mp4",
      posterUrl: "https://cdn.lumora.local/v1.jpg",
      durationSeconds: 20,
      createdAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
  });

  it("creates upload rights declaration", () => {
    const declaration = createRightsDeclaration({
      videoId: "v1",
      sourceType: "creator_upload",
      licenseType: "creator_grant",
      declaredByUserId: "u1",
    });

    expect(declaration.rightsStatus).toBe("declared");
    expect(declaration.licenseType).toBe("creator_grant");
  });

  it("uses license registry", () => {
    expect(getLicenseRule("direct_license").expiryRequired).toBe(true);
    expect(getLicenseRule("royalty_free").commercialUseAllowed).toBe(true);
  });
});
