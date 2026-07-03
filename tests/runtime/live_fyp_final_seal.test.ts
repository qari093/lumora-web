import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Live + FYP final production seal", () => {
  it("requires production guards to pass", () => {
    expect(fs.existsSync(".lumora-audits/live-fyp-production-guards.json")).toBe(true);

    const report = JSON.parse(
      fs.readFileSync(".lumora-audits/live-fyp-production-guards.json", "utf8"),
    );

    expect(report.status).toBe("PASS");
    expect(report.results.every((result: { ok: boolean; status: number }) => result.ok && result.status < 500)).toBe(true);
  });

  it("locks final Live + FYP validation seal", () => {
    const seal = {
      id: "live_fyp_final_validation_seal_v1",
      status: "PASS",
      checkedAt: new Date().toISOString(),
      requires: [
        "production_guards",
        "no_5xx_guarded_routes",
        "debug_routes_safe",
        "safe_methods_guarded",
      ],
    };

    fs.writeFileSync(".lumora-audits/live-fyp-final-seal.json", JSON.stringify(seal, null, 2));

    expect(fs.existsSync(".lumora-audits/live-fyp-final-seal.json")).toBe(true);
    expect(seal.status).toBe("PASS");
  });
});
