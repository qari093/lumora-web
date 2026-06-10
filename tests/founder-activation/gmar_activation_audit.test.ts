import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("GMAR activation audit", () => {
  it("writes GMAR activation audit artifacts", () => {
    expect(fs.existsSync("data/founder-activation/gmar-activation-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/gmar-activation-audit.json")).toBe(true);
    expect(fs.existsSync("docs/founder-activation/gmar-activation-audit.md")).toBe(true);
  });

  it("confirms GMAR mission economy runtime and safety gates", () => {
    const audit = JSON.parse(fs.readFileSync("data/founder-activation/gmar-activation-audit.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.checks.pageHasGmarSignals).toBe(true);
    expect(audit.checks.coreHasRuntimeSignals).toBe(true);
    expect(audit.checks.liveRewardsDisabled).toBe(true);
    expect(audit.checks.testerInvitesBlocked).toBe(true);
    expect(audit.checks.backupLeftoverExists).toBe(false);
  });
});
