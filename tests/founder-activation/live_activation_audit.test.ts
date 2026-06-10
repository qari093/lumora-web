import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Live activation audit", () => {
  it("writes Live activation audit artifacts", () => {
    expect(fs.existsSync("data/founder-activation/live-activation-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/live-activation-audit.json")).toBe(true);
    expect(fs.existsSync("docs/founder-activation/live-activation-audit.md")).toBe(true);
  });

  it("confirms Live room UI, runtime bridges, and safety gates", () => {
    const audit = JSON.parse(fs.readFileSync("data/founder-activation/live-activation-audit.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.checks.pageHasLiveSignals).toBe(true);
    expect(audit.checks.coreHasRuntimeSignals).toBe(true);
    expect(audit.checks.coreHasRoomSignals).toBe(true);
    expect(audit.checks.publicBroadcastOff).toBe(true);
    expect(audit.checks.testerInvitesBlocked).toBe(true);
    expect(audit.checks.backupLeftoverExists).toBe(false);
  });
});
