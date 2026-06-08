import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("live fyp production matrix", () => {
  it("writes Live + FYP production matrix", () => {
    expect(fs.existsSync(".lumora-audits/live-fyp-production-matrix.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/live-fyp-production-matrix.json", "utf8"));
    expect(report.results.length).toBeGreaterThanOrEqual(12);
  });

  it("passes production Live + FYP matrix without 5xx", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/live-fyp-production-matrix.json", "utf8"));
    expect(report.status).toBe("PASS");
    for (const result of report.results) {
      expect(result.status).toBeLessThan(500);
      expect(result.ok).toBe(true);
    }
  });
});
