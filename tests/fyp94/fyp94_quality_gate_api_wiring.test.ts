import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 quality gate API wiring", () => {
  it("wires quality mixed feed into library API", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("buildFyp94QualityMixedFeed");
    expect(route).toContain("qualityMixed");
    expect(route).toContain("archiveCount");
    expect(route).toContain("sourceType");
    expect(route).toContain("humanScore");
    expect(route).toContain("motionScore");
    expect(route).toContain("hasAudio");
  });
});
