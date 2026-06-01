import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath = "docs/audit/lumora_real_validation_mega_pack_01_platform_runtime_auth.json";

describe("Lumora Real Validation Mega Pack 1/3", () => {
  it("passes with provider env requirement allowed", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(["PASS", "PASS_WITH_PROVIDER_ENV_REQUIRED"]).toContain(report.status);
  });

  it("validates route reachability contracts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.routeSummary.passed).toBe(report.routeSummary.total);
  });

  it("validates auth files and schema readiness", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.fileSummary.passed).toBe(report.fileSummary.total);
    expect(report.schemaChecks.userModel).toBe(true);
    expect(report.schemaChecks.sessionModelOrApi).toBe(true);
  });

  it("documents Vercel provider env requirements", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const warnings = report.warnings.join(" ");
    expect(warnings).toContain("DATABASE_URL");
    expect(warnings).toContain("NEXTAUTH_SECRET");
    expect(warnings).toContain("controlled");
  });
});
