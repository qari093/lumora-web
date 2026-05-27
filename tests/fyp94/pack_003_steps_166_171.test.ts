import { describe, expect, it } from "vitest";
import { validateFyp94LicenseProof, assertFyp94LegalIntake } from "../../src/lib/fyp94/legal/validate";
import { createFyp94LicenseProof, storeFyp94LicenseProof } from "../../src/lib/fyp94/legal/proofStore";
import { isFyp94UnsafeSourceText } from "../../src/lib/fyp94/legal/blocklist";
import { appendFyp94LegalAuditEvent, createFyp94LegalAuditEvent } from "../../src/lib/fyp94/legal/audit";

describe("FYP 9.4 Pack 003 — Legal Intake Layer", () => {
  const proof = createFyp94LicenseProof({
    source: "pexels",
    licenseType: "royalty_free_commercial",
    licenseUrl: "https://www.pexels.com/license/",
    sourceUrl: "https://www.pexels.com/video/example",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
  });

  it("validates commercial and modification rights", () => {
    const result = validateFyp94LicenseProof(proof);
    expect(result.ok).toBe(true);
    expect(() => assertFyp94LegalIntake(proof)).not.toThrow();
  });

  it("rejects unsafe or incomplete legal proof", () => {
    const result = validateFyp94LicenseProof({
      ...proof,
      commercialUseAllowed: false,
      modificationAllowed: false,
    });

    expect(result.ok).toBe(false);
    expect(result.reasons).toContain("commercial_use_not_allowed");
    expect(result.reasons).toContain("modification_not_allowed");
  });

  it("stores source proof metadata", () => {
    const store = storeFyp94LicenseProof({}, "asset_1", proof);
    expect(store.asset_1.licenseUrl).toContain("pexels");
  });

  it("blocks unsafe source text", () => {
    expect(isFyp94UnsafeSourceText("youtube trailer rehost")).toBe(true);
    expect(isFyp94UnsafeSourceText("pexels action clip")).toBe(false);
  });

  it("creates legal audit trail", () => {
    const event = createFyp94LegalAuditEvent({
      assetId: "asset_1",
      action: "license_validated",
    });
    const events = appendFyp94LegalAuditEvent([], event);

    expect(events).toHaveLength(1);
    expect(events[0].at).toBeTruthy();
  });
});
