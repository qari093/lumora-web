import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath =
  "docs/audit/lumora_gap_mega_pack_08_stripe_zendoro_live_readiness.json";

describe("Lumora Gap Mega Pack 08 Stripe Zendoro readiness", () => {
  it("creates Stripe Zendoro readiness report", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
  });

  it("validates required checkout and webhook files", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    expect(report.status).toBe("PASS_WITH_SANDBOX_EXECUTION_REQUIRED");

    for (const item of report.fileResults) {
      expect(item.exists).toBe(true);
      expect(item.bytes).toBeGreaterThan(0);
    }
  });

  it("validates payment safety vocabulary", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));

    for (const item of report.vocabularyResults) {
      expect(item.present).toBe(true);
    }

    for (const item of report.sandboxChecks) {
      expect(item.pass).toBe(true);
    }
  });

  it("documents live sandbox and webhook replay requirements", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    const warnings = report.warnings.join(" ");

    expect(warnings).toContain("Stripe test keys");
    expect(warnings).toContain("Webhook replay");
    expect(warnings).toContain("persistent DB records");
  });
});
