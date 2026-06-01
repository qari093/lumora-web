import fs from "node:fs";

describe("Lumora Production Gap Pack 03 main journey runtime", () => {
  const jsonPath = "docs/audit/production-gaps/pack03_main_journey_runtime.json";
  const txtPath = "docs/audit/production-gaps/pack03_main_journey_runtime.txt";

  it("creates main journey runtime reports", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(txtPath)).toBe(true);
    expect(fs.statSync(jsonPath).size).toBeGreaterThan(300);
    expect(fs.statSync(txtPath).size).toBeGreaterThan(300);
  });

  it("validates every launch journey page", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.status).toBe("PASS");
    expect(report.journeyResults.length).toBeGreaterThanOrEqual(9);
    for (const item of report.journeyResults) {
      expect(item.ok).toBe(true);
      expect(item.bytes).toBeGreaterThan(0);
    }
  });

  it("validates critical API handler contracts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    for (const item of report.apiResults) {
      expect(item.ok).toBe(true);
      expect(item.hasHandler).toBe(true);
    }
  });
});
