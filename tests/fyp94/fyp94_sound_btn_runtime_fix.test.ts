import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 sound button runtime fix", () => {
  it("defines btn used by sound toggle", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("const btn:");
    expect(page).toContain("React.CSSProperties");
    expect(page).toContain("Tap for sound");
    expect(page).toContain("toggleMute");
  });
});
