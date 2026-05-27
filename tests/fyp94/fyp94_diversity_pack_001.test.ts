import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 diversity pack 001", () => {
  it("library API uses manifest-only verified content and category mixer", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("manifest.json");
    expect(route).toContain("source === \"pexels\"");
    expect(route).toContain("mixByCategory");
    expect(route).toContain("categoryFromQuery");
    expect(route).not.toContain("readdirSync(dir)");
  });
});
