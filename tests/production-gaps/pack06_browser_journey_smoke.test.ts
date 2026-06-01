import fs from "node:fs";
import { describe, expect, it } from "vitest";

const jsonPath =
  "docs/audit/lumora_gap_pack_06_browser_journey_smoke.json";

describe("Lumora Production Gap Pack 06 browser journey smoke", () => {
  it("creates browser smoke report", () => {
    expect(fs.existsSync(jsonPath)).toBe(true);
  });

  it("validates browser journey reachability", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    expect(report.status).toBe("PASS");
    expect(report.passed).toBe(report.total);
  });

  it("covers core launch routes", () => {
    const report = JSON.parse(fs.readFileSync(jsonPath,"utf8"));
    const paths = report.results.map((r:any)=>r.path);
    for(const required of ["/","/fyp","/live","/gmar","/lumaspace","/zendoro","/login","/signup"]){
      expect(paths).toContain(required);
    }
  });
});
