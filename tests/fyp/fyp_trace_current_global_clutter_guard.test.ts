import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Trace Current global clutter guard", () => {
  it("hides global shell elements while FYP is active", () => {
    const tsx = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(tsx).toContain('document.body.classList.add("lumora-fyp-active")');
    expect(tsx).toContain('document.body.classList.remove("lumora-fyp-active")');
    expect(tsx).toContain("activeLaneChip");
    expect(tsx).toContain('data-visible={chromeVisible}');
    expect(css).toContain("body.lumora-fyp-active");
    expect(css).toContain('nav[aria-label="Global portal navigation"]');
    expect(css).toContain('button[data-testid="lumora-home-beacon"]');
    expect(css).toContain(".activeLaneChip");
  });
});
