import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Trace Current shell cleaner", () => {
  it("moves global shell hiding out of CSS modules into client runtime", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");
    const cleaner = fs.readFileSync("app/fyp/FypShellCleaner.tsx", "utf8");
    const feed = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(css).not.toContain(":global(body.lumora-fyp-active)");
    expect(cleaner).toContain('nav[aria-label="Global portal navigation"]');
    expect(cleaner).toContain('button[data-testid="lumora-home-beacon"]');
    expect(cleaner).toContain('node.style.setProperty("display", "none", "important")');
    expect(feed).toContain("<FypShellCleaner />");
  });
});
