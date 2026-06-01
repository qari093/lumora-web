import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath = "docs/audit/lumora_gap_mega_pack_07_auth_provider_env_db.json";

describe("Lumora Gap Mega Pack 07 auth provider env db readiness", () => {
  it("creates auth provider readiness report", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
  });

  it("validates required auth files and contracts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    expect(report.status).toBe("PASS_WITH_PROVIDER_WIRING_REQUIRED");

    for (const item of report.fileResults) {
      expect(item.exists).toBe(true);
      expect(item.bytes).toBeGreaterThan(0);
    }
  });

  it("validates auth vocabulary and schema support", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));

    for (const item of report.vocabResults) {
      expect(item.present).toBe(true);
    }

    for (const item of report.schemaChecks) {
      expect(item.pass).toBe(true);
    }
  });

  it("documents provider wiring warnings", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    const warnings = report.warnings.join(" ");
    expect(warnings).toContain("provider wiring");
    expect(warnings).toContain("database-backed token persistence");
    expect(warnings).toContain("email delivery");
  });
});
