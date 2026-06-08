import { describe, expect, it } from "vitest";
import fs from "node:fs";

const aliasFiles = [
  "app/api/fyp94/feed/route.ts",
  "app/api/fyp94/health/route.ts",
  "app/api/fyp94/library/route.ts",
  "app/api/fyp94/production-health/route.ts"
];

describe("fyp94 legacy compatibility wrappers", () => {
  it("converts fyp94 legacy endpoints to canonical wrappers", () => {
    for (const file of aliasFiles) {
      if (!fs.existsSync(file)) continue;
      const src = fs.readFileSync(file, "utf8");
      expect(src).toContain("compatibilityJson");
      expect(src).toContain("/api/fyp");
    }
  });

  it("writes audit and documentation artifacts", () => {
    expect(fs.existsSync(".lumora-audits/fyp94-legacy-compatibility-wrappers.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/fyp94-legacy-compatibility-wrappers.md")).toBe(true);
  });
});
