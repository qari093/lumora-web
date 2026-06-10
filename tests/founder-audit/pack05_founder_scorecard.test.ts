import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Founder Audit Pack 05/05", () => {
  it("writes final founder scorecard artifacts", () => {
    expect(fs.existsSync("data/founder-audit/pack05-founder-scorecard.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/founder-pack05-founder-scorecard.json")).toBe(true);
    expect(fs.existsSync("docs/founder-audit/pack05-founder-scorecard.md")).toBe(true);
  });

  it("keeps tester approval separate from technical readiness", () => {
    const data = JSON.parse(fs.readFileSync("data/founder-audit/pack05-founder-scorecard.json", "utf8"));

    expect(typeof data.weightedReadinessPercent).toBe("number");
    expect(data.confirmedReady).toContain("Tester invites remain blocked");
    expect(data.notYetFullyProven.length).toBeGreaterThan(0);
  });
});
