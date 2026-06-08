import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta launch communication pack", () => {
  it("writes launch communication artifacts", () => {
    expect(fs.existsSync("data/private-beta/launch-communication-pack.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-launch-communication-pack.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-launch-communication-pack.md")).toBe(true);
  });

  it("keeps launch communication invite-only and non-public", () => {
    const pack = JSON.parse(fs.readFileSync("data/private-beta/launch-communication-pack.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-launch-communication-pack.json", "utf8"));

    expect(pack.status).toBe("PRIVATE_BETA_LAUNCH_COMMUNICATION_PACK_READY");
    expect(pack.audience).toBe("allowlist_only");
    expect(pack.maxRecipients).toBeLessThanOrEqual(25);
    expect(pack.guards.publicSignupDisabled).toBe(true);
    expect(pack.guards.paymentLiveMode).toBe(false);
    expect(pack.guards.manualReviewRequired).toBe(true);
    expect(pack.guards.noPublicMarketing).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta operator checklist");
  });
});
