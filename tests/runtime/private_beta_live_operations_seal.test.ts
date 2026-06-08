import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta live operations seal", () => {
  it("writes live operations seal artifacts", () => {
    expect(fs.existsSync("data/private-beta/live-operations-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-live-operations-seal.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-live-operations-seal.md")).toBe(true);
  });

  it("keeps live operations controlled", () => {
    const seal = JSON.parse(fs.readFileSync("data/private-beta/live-operations-seal.json","utf8"));

    expect(seal.status).toBe("PRIVATE_BETA_LIVE_OPERATIONS_SEALED");
    expect(Object.values(seal.checks).every((v) => v === "PASS")).toBe(true);
    expect(seal.guards.allowlistOnly).toBe(true);
    expect(seal.guards.publicSignupDisabled).toBe(true);
    expect(seal.guards.paymentLiveMode).toBe(false);
    expect(seal.guards.manualExpansionOnly).toBe(true);
    expect(seal.guards.maxInvites).toBeLessThanOrEqual(25);
    expect(seal.nextCanonicalPhase).toBe("Private beta runtime observation seal");
  });
});
