import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Zendoro activation audit", () => {
  it("writes Zendoro activation audit artifacts", () => {
    expect(fs.existsSync("data/founder-activation/zendoro-activation-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/zendoro-activation-audit.json")).toBe(true);
    expect(fs.existsSync("docs/founder-activation/zendoro-activation-audit.md")).toBe(true);
  });

  it("confirms Zendoro commerce trust layer and safety gates", () => {
    const audit = JSON.parse(fs.readFileSync("data/founder-activation/zendoro-activation-audit.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.checks.pageHasZendoroSignals).toBe(true);
    expect(audit.checks.coreHasRuntimeSignals).toBe(true);
    expect(audit.checks.checkoutDisabled).toBe(true);
    expect(audit.checks.payoutsDisabled).toBe(true);
    expect(audit.checks.testerInvitesBlocked).toBe(true);
    expect(audit.checks.backupLeftoverExists).toBe(false);
  });
});
