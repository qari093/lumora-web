import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 visibility pack 004", () => {
  it("has all visibility locks", () => {
    expect(fs.existsSync(".lumora_fyp94_visibility_pack_001_lock")).toBe(true);
    expect(fs.existsSync(".lumora_fyp94_visibility_pack_002_lock")).toBe(true);
    expect(fs.existsSync(".lumora_fyp94_visibility_pack_003_lock")).toBe(true);
  });

  it("has visible route and API route", () => {
    expect(fs.existsSync("app/fyp94/page.tsx")).toBe(true);
    expect(fs.existsSync("app/api/fyp94/feed/route.ts")).toBe(true);
  });

  it("has browser-ready player", () => {
    const s = fs.readFileSync("src/components/fyp94/Fyp94VisiblePlayer.tsx", "utf8");
    expect(s).toContain("fyp94-visible-player");
    expect(s).toContain("fyp94-video");
    expect(s).toContain("Fyp94Overlay");
  });
});
