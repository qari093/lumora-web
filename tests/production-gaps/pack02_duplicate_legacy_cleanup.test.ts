import fs from "node:fs";

describe("Lumora Production Gap Pack 02 duplicate legacy cleanup", () => {
  const jsonPath = "docs/audit/production-gaps/pack02_duplicate_legacy_cleanup.json";
  const txtPath = "docs/audit/production-gaps/pack02_duplicate_legacy_cleanup.txt";

  it("creates duplicate cleanup audit reports", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(txtPath)).toBe(true);
    expect(fs.statSync(jsonPath).size).toBeGreaterThan(200);
    expect(fs.statSync(txtPath).size).toBeGreaterThan(200);
  });

  it("has no direct duplicate route conflicts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.status).toBe("PASS");
    expect(report.totals.duplicateRoutes).toBe(0);
    expect(report.totals.riskyPageApiOverlap).toBe(0);
  });

  it("keeps canonical launch routes singly owned", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    for (const route of report.protectedRouteStatus) {
      expect(route.ok).toBe(true);
    }
  });
});
