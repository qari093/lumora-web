import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta final seal", () => {
  it("writes final private beta seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_private_beta_ready_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-final-seal.md")).toBe(true);
  });

  it("seals private beta readiness", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-final-seal.json", "utf8"));
    expect(seal.status).toBe("PRIVATE_BETA_READY");
    expect(seal.checks.readinessGate).toBe("PASS");
    expect(seal.checks.productionAccessSmoke).toBe("PASS");
    expect(seal.checks.allowlistGuardAudit).toBe("PASS");
    expect(seal.nextCanonicalPhase).toBe("Private beta controlled invite rollout");
  });
});
