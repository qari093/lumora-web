import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP trace dock NaN guard", () => {
  it("guards curiosity score against NaN in production UI", () => {
    const source = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(source).toContain("Number.isFinite(curiosity) ? curiosity : 0");
    expect(source).toContain("dominantLane: summary.dominantLane || selectedLane");
    expect(source).toContain("Number.isFinite(Number(traceSummary.curiosityScore))");
  });
});
