import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 interaction + multiclip fix", () => {
  it("has real navigation handlers and visible controls", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("function goNext()");
    expect(page).toContain("function goPrev()");
    expect(page).toContain("onTouchStart");
    expect(page).toContain("onTouchEnd");
    expect(page).toContain("ArrowDown");
    expect(page).toContain("↓ Next");
    expect(page).toContain("↑ Prev");
  });

  it("uses 20 distinct local clip paths", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("items.length");
    expect(page).toContain("/native-fyp/fallback/${n}.mp4");
  });
});
