import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta monitor loop", () => {
  it("writes monitor loop artifacts", () => {
    expect(fs.existsSync("data/private-beta/monitor-loop.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-monitor-loop.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-monitor-loop.md")).toBe(true);
  });

  it("keeps beta monitoring conservative", () => {
    const monitor = JSON.parse(fs.readFileSync("data/private-beta/monitor-loop.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-monitor-loop.json", "utf8"));

    expect(monitor.status).toBe("PRIVATE_BETA_MONITOR_LOOP_READY");
    expect(monitor.metrics.paymentLiveMode).toBe(false);
    expect(monitor.metrics.publicSignupDisabled).toBe(true);
    expect(monitor.metrics.allowlistOnly).toBe(true);
    expect(monitor.guards.pauseOnAny5xxSpike).toBe(true);
    expect(monitor.guards.pauseOnUnauthorizedAccess).toBe(true);
    expect(audit.status).toBe("PRIVATE_BETA_MONITOR_LOOP_READY");
    expect(audit.nextCanonicalPhase).toBe("Private beta first wave observation");
  });
});
