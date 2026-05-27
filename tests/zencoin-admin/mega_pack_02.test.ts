import { describe, expect, it } from "vitest";

import { createTreasuryRuntime } from "@/src/core/zencoin/treasury/treasuryRuntime";
import { createGovernanceRuntime } from "@/src/core/zencoin/governance/governanceRuntime";
import { createFraudRuntime } from "@/src/core/zencoin/fraud/fraudRuntime";
import { createAdminRuntime } from "@/src/core/zencoin/admin/adminRuntime";

describe("Zencoin/Admin Mega Pack 02", () => {
  it("creates treasury runtime", () => {
    expect(createTreasuryRuntime().active).toBe(true);
  });

  it("creates governance runtime", () => {
    expect(createGovernanceRuntime().voting).toBe(true);
  });

  it("creates fraud runtime", () => {
    expect(createFraudRuntime().enabled).toBe(true);
  });

  it("creates admin runtime", () => {
    expect(createAdminRuntime().active).toBe(true);
  });
});
