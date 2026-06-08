import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta daily health snapshot", () => {
  it("writes daily health artifacts", () => {
    expect(fs.existsSync("data/private-beta/daily-health-snapshot.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-daily-health-snapshot.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-daily-health-snapshot.md")).toBe(true);
  });

  it("keeps daily health green", () => {
    const snapshot = JSON.parse(fs.readFileSync("data/private-beta/daily-health-snapshot.json","utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-daily-health-snapshot.json","utf8"));

    expect(snapshot.status).toBe("PRIVATE_BETA_DAILY_HEALTH_READY");
    expect(snapshot.metrics.critical5xx).toBe(0);
    expect(snapshot.metrics.unauthorizedAccessEvents).toBe(0);
    expect(snapshot.metrics.paymentLiveMode).toBe(false);
    expect(snapshot.metrics.publicSignupEnabled).toBe(false);
    expect(snapshot.metrics.allowlistOnly).toBe(true);

    expect(audit.status).toBe("PRIVATE_BETA_DAILY_HEALTH_READY");
    expect(audit.nextCanonicalPhase).toBe("Private beta feedback collection loop");
  });
});
