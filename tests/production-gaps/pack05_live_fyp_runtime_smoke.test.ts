import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath =
  "docs/audit/lumora_gap_pack_05_live_fyp_runtime_smoke.json";

describe("Lumora Production Gap Pack 05 live fyp runtime smoke", () => {
  it("creates runtime smoke report", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
  });

  it("validates live and fyp runtime contracts", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    expect(report.status).toBe("PASS");

    for(const item of report.results){
      expect(item.pass).toBe(true);
    }
  });

  it("contains runtime warnings", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    expect(report.warnings.length).toBeGreaterThan(0);
  });
});
