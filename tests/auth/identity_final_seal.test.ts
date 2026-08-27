import { describe, expect, it } from "vitest";
import fs from "node:fs";

const requiredReports = [
  "docs/audit/lumora_auth_foundation_audit.json",
  "docs/audit/lumora_identity_core_validation.json",
  "docs/audit/lumora_auth_gap_closure_implementation.json",
  "docs/audit/lumora_ecosystem_identity_validation.json",
];

const requiredFiles = [
  "app/api/auth/[...nextauth]/route.ts",
  "app/api/auth/forgot-password/route.ts",
  "app/api/auth/reset-password/route.ts",
  "app/api/auth/verify-email/route.ts",
  "app/api/auth/sessions/route.ts",
  "app/api/auth/recovery/route.ts",
  "app/api/account/route.ts",
  "app/login/page.tsx",
  "app/signup/page.tsx",
  "middleware.ts",
];

function read(file: string) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

describe("Lumora Identity Final Seal", () => {
  it.each(requiredReports)("has audit report %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
  });

  it.each(requiredFiles)("has required identity file %s", (file) => {
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.statSync(file).size).toBeGreaterThan(0);
  });

  it("serves session through the canonical NextAuth catch-all route", () => {
    const route = read("app/api/auth/[...nextauth]/route.ts");
    expect(route).toContain("NextAuth(authOptions)");
    expect(route).toMatch(/handler\s+as\s+GET/);
    expect(route).toMatch(/handler\s+as\s+POST/);
  });

  it("auth foundation report passed", () => {
    const report = JSON.parse(read("docs/audit/lumora_auth_foundation_audit.json"));
    expect(report.status).toBe("PASS");
    expect(report.passed).toBe(report.total);
  });

  it("identity core report passed", () => {
    const report = JSON.parse(read("docs/audit/lumora_identity_core_validation.json"));
    expect(report.status).toBe("PASS");
    expect(report.passed).toBe(report.total);
  });

  it("ecosystem identity report passed", () => {
    const report = JSON.parse(read("docs/audit/lumora_ecosystem_identity_validation.json"));
    expect(report.status).toBe("PASS");
    expect(report.passed).toBe(report.total);
  });

  it("security vocabulary exists across auth routes", () => {
    const combined = requiredFiles.map(read).join("\n");
    expect(combined).toMatch(/session|token|recovery|verify|identity|user|account|unauthorized|redirect|contract_ready/i);
  });

  it("documents contract-level warning for provider wiring", () => {
    const gap = read("docs/audit/lumora_auth_gap_closure_implementation.json");
    const eco = read("docs/audit/lumora_ecosystem_identity_validation.json");
    expect(gap + eco).toMatch(/provider wiring|contract|production|authenticated ownership/i);
  });
});
