import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 dynamic pool fix", () => {
  it("removes hardcoded 20-item page pool and uses dynamic library API", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(page).toContain('/api/fyp94/library');
    expect(page).toContain("items.length");
    expect(page).not.toContain("Array.from({ length: 20 })");

    expect(route).toContain("public/native-fyp/real");
    expect(route).not.toContain("readdirSync");
  });
});
