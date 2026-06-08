import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("main user journey validation artifacts", () => {
  it("writes production journey smoke report", () => {
    expect(fs.existsSync(".lumora-audits/production-main-journey-smoke.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/production-main-journey-smoke.json", "utf8"));
    expect(report.status).toBe("PASS");
    expect(report.results.length).toBeGreaterThanOrEqual(7);
  });

  it("writes journey validation documentation", () => {
    expect(fs.existsSync("docs/runtime/main-user-journey-validation.md")).toBe(true);
  });
});
