import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 video stuck fix", () => {
  it("forces remount and dynamic src", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("?v=${index}");
    expect(page).toContain("DEBUG_INDEX");
    expect(page).toContain('preload="auto"');
    expect(page).toContain("nextItem");
    expect(page).toContain("`${current.id}-${index}`");
  });
});
