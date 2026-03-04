import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("GMAR playable surface (locked)", () => {
  it("has /gmar/play route page", () => {
    expect(fs.existsSync("app/gmar/play/page.tsx")).toBe(true);
  });

  it("GMAR portal page links to /gmar/play", () => {
    const s = fs.readFileSync("app/gmar/page.tsx", "utf8");
    expect(s.includes('href="/gmar/play"')).toBe(true);
  });

  it("MiniArena exists and contains alive marker", () => {
    const s = fs.readFileSync("components/gmar/MiniArena.tsx", "utf8");
    expect(s.includes("LUMORA_GMAR_PLAYABLE_SURFACE")).toBe(true);
  });
});
