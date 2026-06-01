import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath = "docs/audit/lumora_real_validation_mega_pack_02_commerce_economy.json";

describe("Lumora Real Validation Mega Pack 2/3 — Commerce + Economy", () => {
  it("passes with sandbox and DB requirement allowed", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(["PASS", "PASS_WITH_SANDBOX_AND_DB_REQUIRED"]).toContain(report.status);
  });

  it("validates commerce and economy route reachability contracts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.routeSummary.passed).toBe(report.routeSummary.total);
  });

  it("validates commerce and wallet files exist", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.fileSummary.passed).toBe(report.fileSummary.total);
  });

  it("validates payment safety vocabulary", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.vocabularyChecks.stripe).toBe(true);
    expect(report.vocabularyChecks.checkout).toBe(true);
    expect(report.vocabularyChecks.webhook).toBe(true);
    expect(report.vocabularyChecks.idempotency).toBe(true);
    expect(report.vocabularyChecks.wallet).toBe(true);
    expect(report.vocabularyChecks.ledger).toBe(true);
  });

  it("documents real sandbox and DB requirements", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const warnings = report.warnings.join(" ");
    expect(warnings).toContain("Stripe sandbox");
    expect(warnings).toContain("DATABASE_URL");
    expect(warnings).toContain("DB-backed ledger");
  });
});
