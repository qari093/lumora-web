import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 sound enable fix", () => {
  it("adds user-controlled mute toggle", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page).toContain("const [muted, setMuted]");
    expect(page).toContain("muted={muted}");
    expect(page).toContain("function toggleMute()");
    expect(page).toContain("Tap for sound");
    expect(page).toContain("Sound on");
  });
});
