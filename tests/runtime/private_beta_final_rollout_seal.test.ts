import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta final rollout seal", () => {
  it("writes final rollout seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-final-rollout-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_private_beta_controlled_rollout_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-final-rollout-seal.md")).toBe(true);
  });

  it("seals controlled invite rollout", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-final-rollout-seal.json", "utf8"));
    expect(seal.status).toBe("PRIVATE_BETA_CONTROLLED_INVITE_ROLLOUT_SEALED");
    expect(seal.checks.privateBetaFinalSeal).toBe("PASS");
    expect(seal.checks.controlledInviteRollout).toBe("PASS");
    expect(seal.checks.inviteListCreation).toBe("PASS");
    expect(seal.checks.inviteIssueAudit).toBe("PASS");
    expect(seal.rollout.accessModel).toBe("allowlist_only");
    expect(seal.rollout.publicSignupDisabled).toBe(true);
    expect(seal.rollout.paymentLiveMode).toBe(false);
    expect(seal.rollout.maxWaveOneInvites).toBeLessThanOrEqual(25);
    expect(seal.nextCanonicalPhase).toBe("Private beta monitor loop");
  });
});
