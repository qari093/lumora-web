import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 Pack 7 Integrated", () => {
  it("applies diversity enforcement inside API", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("enforceFyp94Diversity");
    expect(route).toContain("injectFyp94Wildcard");
  });
});
