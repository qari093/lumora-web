import { describe, expect, it } from "vitest";
import fs from "node:fs";

const requiredLocks = [
  ".lumora_runtime_consolidation_audit_lock",
  ".lumora_main_user_journey_validation_lock",
  ".lumora_zendoro_payments_validation_lock",
  ".lumora_live_fyp_runtime_validation_lock",
  ".lumora_browser_smoke_validation_lock",
];

const requiredReports = [
  "docs/audit/lumora_runtime_consolidation_audit.json",
  "docs/audit/lumora_main_user_journey_validation.json",
  "docs/audit/lumora_zendoro_payments_validation.json",
  "docs/audit/lumora_live_fyp_runtime_validation.json",
  "docs/audit/lumora_browser_smoke_validation.json",
];

describe("Lumora private beta readiness seal", () => {
  it.each(requiredLocks)("has lock %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
  });

  it.each(requiredReports)("has audit report %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
  });

  it("browser smoke report passed", () => {
    const report = JSON.parse(fs.readFileSync("docs/audit/lumora_browser_smoke_validation.json", "utf8"));
    expect(report.pass).toBe(true);
    expect(report.passed).toBe(report.total);
  });

  it("main journey report passed", () => {
    const report = JSON.parse(fs.readFileSync("docs/audit/lumora_main_user_journey_validation.json", "utf8"));
    expect(report.pass).toBe(true);
  });
});
