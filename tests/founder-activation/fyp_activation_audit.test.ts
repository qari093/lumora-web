import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP activation audit", () => {
  it("writes FYP activation audit artifacts", () => {
    expect(fs.existsSync("data/founder-activation/fyp-activation-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/fyp-activation-audit.json")).toBe(true);
    expect(fs.existsSync("docs/founder-activation/fyp-activation-audit.md")).toBe(true);
  });

  it("confirms FYP activation is complete and safe", () => {
    const audit = JSON.parse(fs.readFileSync("data/founder-activation/fyp-activation-audit.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.checks.pageHasAllRequiredText).toBe(true);
    expect(audit.checks.coreHasAllRequiredRuntime).toBe(true);
    expect(audit.checks.testerInvitesBlocked).toBe(true);
    expect(audit.checks.paymentLiveModeOff).toBe(true);
  });
});
