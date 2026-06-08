import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta readiness gate", () => {
  it("writes private beta readiness artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-readiness-gate.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-readiness-gate.md")).toBe(true);
  });

  it("passes only when canonical pre-beta locks and routes exist", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-readiness-gate.json", "utf8"));
    expect(report.status).toBe("PASS");
    expect(report.requiredLocks.every((r: any) => r.exists)).toBe(true);
    expect(report.privateBetaRoutes.every((r: any) => r.exists && r.bytes > 0)).toBe(true);
  });
});
