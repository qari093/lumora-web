import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath = "docs/audit/lumora_real_validation_mega_pack_03_runtime_beta_seal.json";

describe("Lumora Real Validation Mega Pack 3/3 — Runtime Beta Seal", () => {
  it("creates final runtime beta seal", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.status).toBe("SEALED_WITH_MANUAL_REAL_WORLD_REQUIREMENTS");
  });

  it("validates runtime route contracts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.routeSummary.passed).toBe(report.routeSummary.total);
  });

  it("validates previous real-validation packs", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.previousPackChecks.pack1Present).toBe(true);
    expect(report.previousPackChecks.pack1Accepted).toBe(true);
    expect(report.previousPackChecks.pack2Present).toBe(true);
    expect(report.previousPackChecks.pack2Accepted).toBe(true);
  });

  it("validates runtime systems exist", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.runtimeChecks.fypRuntimePresent).toBe(true);
    expect(report.runtimeChecks.liveRuntimePresent).toBe(true);
    expect(report.runtimeChecks.mediaHealthPresent).toBe(true);
    expect(report.runtimeChecks.telemetryPresent).toBe(true);
    expect(report.runtimeChecks.moderationPresent).toBe(true);
    expect(report.runtimeChecks.privateBetaGatePresent).toBe(true);
  });

  it("keeps beta decision controlled until manual E2E", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.betaDecision).toBe("CONTROLLED_PRIVATE_BETA_ALLOWED_AFTER_ENV_AND_E2E_CHECKS");
    const warnings = report.warnings.join(" ");
    expect(warnings).toContain("controlled beta");
    expect(warnings).toContain("Stripe sandbox");
    expect(warnings).toContain("Auth signup");
  });
});
