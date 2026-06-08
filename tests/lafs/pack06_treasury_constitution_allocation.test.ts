import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  LAFS_DEFAULT_TREASURY_ALLOCATION_RULE,
  allocateTreasury,
  allocationTotalPct,
  createConstitutionDiff,
  createFinancialConstitutionView,
  validateTreasuryAllocationRule,
} from "../../src/core/lafs/treasuryConstitution";

describe("LAFS Pack 06/08 treasury constitution + allocation", () => {
  it("validates governed allocation rule totals", () => {
    const validation = validateTreasuryAllocationRule(LAFS_DEFAULT_TREASURY_ALLOCATION_RULE);

    expect(validation.ok).toBe(true);
    expect(allocationTotalPct(LAFS_DEFAULT_TREASURY_ALLOCATION_RULE)).toBe(100);
  });

  it("allocates treasury using minor units", () => {
    const split = allocateTreasury(10_000);

    expect(split.operationsMinor).toBe(4_500);
    expect(split.reserveMinor).toBe(2_500);
    expect(split.growthMinor).toBe(1_500);
    expect(split.creatorRewardsMinor).toBe(1_000);
    expect(split.emergencyBufferMinor).toBe(500);
    expect(split.remainderMinor).toBe(0);
  });

  it("creates constitution view and amendment diff", () => {
    const constitution = createFinancialConstitutionView();
    const newRule = {
      ...LAFS_DEFAULT_TREASURY_ALLOCATION_RULE,
      version: 2,
      operationsPct: 40,
      reservePct: 30,
    };

    const diff = createConstitutionDiff(LAFS_DEFAULT_TREASURY_ALLOCATION_RULE, newRule);

    expect(constitution.status).toBe("FINANCIAL_CONSTITUTION_ACTIVE");
    expect(constitution.sections.betaGuards.paymentLiveMode).toBe(false);
    expect(diff.requiresCouncilApproval).toBe(true);
    expect(diff.changes.length).toBe(2);
  });

  it("rejects invalid allocation totals", () => {
    const invalid = {
      ...LAFS_DEFAULT_TREASURY_ALLOCATION_RULE,
      operationsPct: 44,
    };

    const validation = validateTreasuryAllocationRule(invalid);

    expect(validation.ok).toBe(false);
    expect(validation.errors).toContain("allocation_total_must_equal_100");
  });

  it("writes treasury constitution audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack06-treasury-constitution-allocation.json")).toBe(true);
    expect(fs.existsSync("data/lafs/treasury-constitution-allocation.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack06-treasury-constitution-allocation.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack06_treasury_constitution_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack06-treasury-constitution-allocation.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("TREASURY_CONSTITUTION_ALLOCATION_READY");
    expect(audit.manifest.activeAllocationRule.totalPct).toBe(100);
  });
});
