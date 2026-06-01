import fs from "node:fs";

describe("Lumora Production Gap Pack 01 reality audit", () => {
  const jsonPath = "docs/audit/production-gaps/pack01_reality_audit.json";
  const txtPath = "docs/audit/production-gaps/pack01_reality_audit.txt";

  it("creates reality audit reports", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(txtPath)).toBe(true);
    expect(fs.statSync(jsonPath).size).toBeGreaterThan(200);
    expect(fs.statSync(txtPath).size).toBeGreaterThan(200);
  });

  it("validates required core route contracts exist", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.totals.requiredChecks).toBeGreaterThan(20);
    expect(report.totals.missingChecks).toBe(0);
  });

  it("documents runtime reality warnings", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.warnings.join(" ")).toContain("does not prove real provider-backed runtime behavior");
    expect(report.warnings.join(" ")).toContain("Stripe sandbox");
  });
});
