import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("NEXA activation audit", () => {
  it("writes NEXA activation audit artifacts", () => {
    expect(fs.existsSync("data/founder-activation/nexa-activation-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/nexa-activation-audit.json")).toBe(true);
    expect(fs.existsSync("docs/founder-activation/nexa-activation-audit.md")).toBe(true);
  });

  it("confirms NEXA guidance, wellbeing, trust layer and safety gates", () => {
    const audit = JSON.parse(fs.readFileSync("data/founder-activation/nexa-activation-audit.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.checks.pageHasNexaSignals).toBe(true);
    expect(audit.checks.coreHasSourceModuleSignals).toBe(true);
    expect(audit.checks.coreHasRuntimeSignals).toBe(true);
    expect(audit.checks.aiAutonomyOff).toBe(true);
    expect(audit.checks.medicalClaimsOff).toBe(true);
    expect(audit.checks.testerInvitesBlocked).toBe(true);
    expect(audit.checks.backupLeftoverExists).toBe(false);
  });
});
