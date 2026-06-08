import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta controlled invite rollout", () => {
  it("writes controlled rollout artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-controlled-invite-rollout.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-controlled-invite-rollout.md")).toBe(true);
  });

  it("keeps private beta controlled and non-public", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-controlled-invite-rollout.json", "utf8"));
    expect(report.status).toBe("PRIVATE_BETA_CONTROLLED_ROLLOUT_READY");
    expect(report.rollout.accessModel).toBe("allowlist_only");
    expect(report.rollout.initialBatchSize).toBeLessThanOrEqual(25);
    expect(report.rollout.maxFirstWave).toBeLessThanOrEqual(100);
    expect(report.rollout.publicLaunchAllowed).toBe(false);
    expect(report.guards.privateBetaFinalSeal).toBe("PASS");
    expect(report.guards.paymentLiveMode).toBe(false);
  });
});
