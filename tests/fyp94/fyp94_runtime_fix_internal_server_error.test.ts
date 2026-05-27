import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 runtime fix", () => {
  it("does not fetch localhost from server page", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");
    expect(page).not.toContain("fetch(`${base}/api/fyp94/feed`");
    expect(page).toContain("buildFyp94FinalFeed");
    expect(page).toContain("Fyp94VisiblePlayer");
  });
});
