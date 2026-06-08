import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("zendoro payment production smoke", () => {
  it("writes production payment smoke report", () => {
    expect(fs.existsSync(".lumora-audits/zendoro-payment-production-smoke.json")).toBe(true);
    const report = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-production-smoke.json", "utf8"));
    expect(report.status).toBe("PASS");
  });

  it("keeps payment endpoints safe without Stripe env", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/zendoro-payment-production-smoke.json", "utf8"));
    for (const result of report.results) {
      expect(result.status).toBeLessThan(504);
      expect(result.bytes).toBeGreaterThan(0);
      expect(result.jsonValid).toBe(true);
    }
  });
});
