import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath = "docs/audit/lumora_gap_pack_04_zendoro_stripe_sandbox.json";

describe("Lumora Production Gap Pack 04 Zendoro Stripe sandbox contract", () => {
  it("creates Zendoro Stripe audit report", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.system).toContain("Zendoro Stripe");
  });

  it("validates Zendoro and Stripe payment contract files", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.status).toBe("PASS");
    for (const item of report.fileResults) {
      expect(item.exists).toBe(true);
      expect(item.bytes).toBeGreaterThan(0);
    }
  });

  it("documents that live Stripe sandbox settlement is still required", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    expect(report.warnings.join(" ")).toContain("not real Stripe settlement");
    expect(report.warnings.join(" ")).toContain("sandbox checkout");
  });
});
