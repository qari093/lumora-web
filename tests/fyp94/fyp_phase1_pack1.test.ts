import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Phase1 Pack1", () => {
  it("has real-life query bank", () => {
    const s = fs.readFileSync("scripts/fyp94/real_queries.mjs","utf8");
    expect(s).toContain("people arguing");
    expect(s).toContain("funny fail");
    expect(s).toContain("crowd cheering");
  });

  it("has multi-page fetch logic", () => {
    const s = fs.readFileSync("scripts/fyp94/fetch_base.mjs","utf8");
    expect(s).toContain("page <= 3");
    expect(s).toContain("per_page=10");
  });
});
