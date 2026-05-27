import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP feed wiring", () => {
  it("uses FypVideoCard inside feed and mounts on homepage", () => {
    const feed = fs.readFileSync("components/fyp/FypFeed.tsx", "utf8");
    const page = fs.readFileSync("app/page.tsx", "utf8");

    expect(feed).toContain("FypVideoCard");
    expect(feed).toContain("activeIndex");
    expect(feed).toContain("scroll");
    expect(page).toContain("FypFeed");
  });
});
