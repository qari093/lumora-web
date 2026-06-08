import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LAFS Pack 08/08 final pre-beta seal", () => {
  it("writes final pre-beta seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack08-final-pre-beta-seal.json")).toBe(true);
    expect(fs.existsSync("data/lafs/final-pre-beta-seal.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack08-final-pre-beta-seal.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pre_beta_safe_mode_sealed_lock")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack08_final_pre_beta_seal_lock")).toBe(true);
  });

  it("seals all 8 packs in pre-beta safe mode", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack08-final-pre-beta-seal.json", "utf8"));

    expect(seal.status).toBe("PASS");
    expect(seal.manifest.status).toBe("LAFS_PRE_BETA_EXECUTION_CHAIN_COMPLETE");
    expect(seal.manifest.completedPacks).toBe(8);
    expect(seal.requiredLocks.every((item: any) => item.exists)).toBe(true);
    expect(seal.requiredAudits.every((item: any) => item.exists && item.status === "PASS")).toBe(true);
    expect(seal.requiredFiles.every((item: any) => item.exists && item.bytes > 0)).toBe(true);
  });

  it("keeps LAFS safe for private beta", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack08-final-pre-beta-seal.json", "utf8"));

    expect(seal.manifest.guards.paymentLiveMode).toBe(false);
    expect(seal.manifest.guards.noAutonomousMoneyMovement).toBe(true);
    expect(seal.manifest.guards.humanApprovalRequired).toBe(true);
    expect(seal.manifest.guards.dashboardReadOnly).toBe(true);
    expect(seal.manifest.guards.stripeWebhookSignatureRequired).toBe(true);
    expect(seal.manifest.nextCanonicalPhase).toBe("Resume private beta with LAFS pre-beta safe mode sealed");
  });
});
