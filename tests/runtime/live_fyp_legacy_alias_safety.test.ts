import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("live fyp legacy alias safety", () => {
  it("writes legacy alias safety report", () => {
    expect(fs.existsSync(".lumora-audits/live-fyp-legacy-alias-safety.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/live-fyp-legacy-alias-safety.json", "utf8"));
    expect(report.results.length).toBeGreaterThanOrEqual(10);
  });

  it("keeps legacy aliases below 5xx", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/live-fyp-legacy-alias-safety.json", "utf8"));
    expect(report.status).toBe("PASS");
    for (const result of report.results) {
      expect(result.status).toBeLessThan(500);
      expect(result.ok).toBe(true);
    }
  });
});
