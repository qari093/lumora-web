import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 12 — Human First Rules Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");
  const visibleText = src
    .replace(/viewBox/g, "")
    .replace(/data-testid/g, "")
    .replace(/objectPosition/g, "");

  it("does not expose traditional toxic social metrics", () => {
    expect(visibleText).not.toMatch(/\bfollowers?\b/i);
    expect(visibleText).not.toMatch(/\bfollowing\b/i);
    expect(visibleText).not.toMatch(/\blikes?\b/i);
    expect(visibleText).not.toMatch(/\bviews?\b/i);
    expect(visibleText).not.toMatch(/\brank\b/i);
  });

  it("keeps curiosity as the primary visible metric", () => {
    expect(src).toContain('"curiosity"');
    expect(src).toContain('aria-label={label || "Curiosity"}');
    expect(src).toContain("30%");
  });

  it("keeps story and collection language instead of transactional language", () => {
    expect(src).toContain("Genesis Collection");
    expect(src).not.toContain("Saved Successfully");
    expect(src).not.toContain("Transaction");
  });

  it("keeps the interface minimal and human-first", () => {
    expect(src).toContain("Deep");
    expect(src).toContain("Board");
    expect(src).toContain("Share");
    expect(src).toContain("LumaSpace");
  });
});
