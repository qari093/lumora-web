import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("main user journey API contracts", () => {
  it("writes API contract smoke report", () => {
    expect(fs.existsSync(".lumora-audits/production-main-api-contracts.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/production-main-api-contracts.json", "utf8"));
    expect(report.status).toBe("PASS");
    expect(report.results.length).toBeGreaterThanOrEqual(6);
  });

  it("has no 5xx API responses in main journey contract", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/production-main-api-contracts.json", "utf8"));
    for (const result of report.results) {
      expect(result.status).toBeLessThan(500);
      expect(result.bytes).toBeGreaterThan(0);
    }
  });
});
