import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 hard runtime page fix", () => {
  it("uses standalone client page without server-side feed dependency", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain('"use client"');
    expect(page).toContain("makeItems");
    expect(page).toContain("fyp94-visible-player");
    expect(page).toContain("fyp94-video");
    expect(page).not.toContain("fetch(");
    expect(page).not.toContain("@/src/lib/fyp94/feed/build");
  });
});
