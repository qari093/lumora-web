import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("production guard smoke", () => {
  it("writes production guard report", () => {
    expect(fs.existsSync(".lumora-audits/production-guard-smoke.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/production-guard-smoke.json", "utf8"));
    expect(report.results.length).toBeGreaterThanOrEqual(9);
  });

  it("blocks debug/dev routes in production", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/production-guard-smoke.json", "utf8"));
    expect(report.status).toBe("PASS");
    for (const result of report.results) {
      expect(result.status).toBe(404);
    }
  });
});
