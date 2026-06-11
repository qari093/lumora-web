import { describe, expect, it } from "vitest";

import {
  validateAllFypSourceLicensePolicies,
  validateFypLicenseProof
} from "@/src/core/fyp/sources/licenseProofValidator";

describe("FYP Mega Pack 02 — License Proof Validator", () => {
  it("accepts public domain source with source URL", () => {
    const result = validateFypLicenseProof({
      sourceId: "NASA",
      sourceUrl: "https://www.nasa.gov/example.mp4"
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("download_allowed");
  });

  it("blocks missing license proof for rights-tagged sources", () => {
    const result = validateFypLicenseProof({
      sourceId: "EUROPEANA",
      sourceUrl: "https://example.org/video"
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("missing_license_or_rights_tag");
  });

  it("blocks YouTube downloads and requires official channel", () => {
    const result = validateFypLicenseProof({
      sourceId: "YOUTUBE_OFFICIAL",
      sourceUrl: "https://youtube.com/watch?v=test",
      licenseName: "official",
      commercialReuseAllowed: true,
      embedOnly: false,
      officialChannel: false
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("non_official_youtube_source");
    expect(result.errors).toContain("youtube_download_attempt");
  });

  it("accepts official YouTube embeds only", () => {
    const result = validateFypLicenseProof({
      sourceId: "YOUTUBE_OFFICIAL",
      sourceUrl: "https://youtube.com/watch?v=test",
      licenseName: "official",
      commercialReuseAllowed: true,
      embedOnly: true,
      officialChannel: true
    });

    expect(result.ok).toBe(true);
    expect(result.mode).toBe("embed_only");
  });

  it("enforces attribution for Creative Commons sources", () => {
    const result = validateFypLicenseProof({
      sourceId: "WIKIMEDIA",
      sourceUrl: "https://commons.wikimedia.org/video",
      licenseName: "CC BY-SA",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      commercialReuseAllowed: true
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("missing_attribution_when_required");
  });

  it("validates hard reject policy coverage for all 48 sources", () => {
    expect(validateAllFypSourceLicensePolicies()).toBe(true);
  });
});
