import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { createTransparencyLogEntry } from "@/src/monetization/compliance/transparency";
import { validateAdDisclosure } from "@/src/monetization/compliance/disclosure";
import { validateDataProtection } from "@/src/monetization/compliance/dataProtection";
import { createComplianceAudit } from "@/src/monetization/compliance/audit";
import { validateMonetizationCompliance } from "@/src/monetization/compliance/system";

describe("Monetization Pack21 — Trust & Compliance", () => {
  it("creates transparency log", () => {
    const log = createTransparencyLogEntry({
      id: "l1",
      eventType: "ad_shown",
      actorId: "u1",
      reason: "green_state",
      createdAt: "2026-05-06T00:00:00.000Z",
    });

    expect(log.createdAt).toBe("2026-05-06T00:00:00.000Z");
  });

  it("validates ad disclosure", () => {
    expect(validateAdDisclosure({
      label: "Sponsored",
      visible: true,
      sponsorName: "Sponsor",
    }).ok).toBe(true);
  });

  it("validates data protection", () => {
    expect(validateDataProtection({
      usesDemographics: false,
      usesRawSensitiveData: false,
      usesSignalOnlyTargeting: true,
      userCanOptOut: true,
    }).ok).toBe(true);
  });

  it("creates audit result", () => {
    expect(createComplianceAudit({
      transparencyOk: true,
      disclosureOk: true,
      dataProtectionOk: true,
    }).ok).toBe(true);
  });

  it("validates full compliance system", () => {
    const result = validateMonetizationCompliance();

    expect(result.ok).toBe(true);
    expect(result.disclosure.ok).toBe(true);
    expect(result.protection.ok).toBe(true);
    expect(fs.existsSync("docs/monetization_compliance.md")).toBe(true);
  });
});
