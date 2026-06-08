import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta production access smoke", () => {
  it("writes production access smoke report", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-production-access-smoke.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-production-access-smoke.json", "utf8"));
    expect(report.results.length).toBeGreaterThanOrEqual(7);
  });

  it("keeps private beta access routes below 5xx", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-production-access-smoke.json", "utf8"));
    expect(report.status).toBe("PASS");
    for (const result of report.results) {
      expect(result.status).toBeLessThan(500);
      expect(result.ok).toBe(true);
    }
  });
});
