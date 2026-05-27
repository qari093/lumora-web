import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 fresh session feed", () => {
  it("loads dynamic library and shuffles per session", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("/api/fyp94/library?fresh=");
    expect(page).toContain("shuffle(data.items");
    expect(page).toContain("(v + 1) % items.length");
    expect(page).toContain("onEnded={goNext}");
    expect(page).toContain("onClick={togglePlay}");
  });
});
