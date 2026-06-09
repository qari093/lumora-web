import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Ecosystem Pack 01/08 surface validation", () => {
  it("writes ecosystem surface validation artifacts", () => {
    expect(fs.existsSync("data/ecosystem/pack01-surface-validation.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/ecosystem-pack01-surface-validation.json")).toBe(true);
    expect(fs.existsSync("docs/ecosystem/pack01-surface-validation.md")).toBe(true);
    expect(fs.existsSync(".lumora_ecosystem_pack01_surface_validation_lock")).toBe(true);
  });

  it("passes only when ecosystem approval gate blocks tester actions", () => {
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/ecosystem-pack01-surface-validation.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("ECOSYSTEM_SURFACE_VALIDATION_READY");
    expect(audit.manifest.guards.ecosystemApprovalRequired).toBe(true);
    expect(audit.manifest.guards.testerSelectionBlocked).toBe(true);
    expect(audit.manifest.guards.inviteIssuanceBlocked).toBe(true);
    expect(audit.manifest.guards.internalValidationOnly).toBe(true);
  });

  it("requires all primary ecosystem route files", () => {
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/ecosystem-pack01-surface-validation.json", "utf8"));

    expect(audit.manifest.summary.requiredPagesOk).toBe(true);
    expect(audit.manifest.pages.filter((p: any) => p.required).every((p: any) => p.exists && p.bytes > 0)).toBe(true);
  });
});
