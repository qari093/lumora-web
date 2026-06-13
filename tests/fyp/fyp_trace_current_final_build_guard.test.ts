import fs from "node:fs";

describe("Trace Current final build guard", () => {
  it("keeps CSS module pure and syntax-safe", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).not.toContain(":global(body.lumora-fyp-active)");
    expect(css).not.toMatch(/\n\s+display:\s*none\s*!important;\s*\}\s*\n\s*\.activeLaneChip/);
  });

  it("keeps FYP shell cleaner active", () => {
    const cleaner = fs.readFileSync("app/fyp/FypShellCleaner.tsx", "utf8");
    const feed = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(cleaner).toContain("lumora-fyp-active");
    expect(cleaner).toContain("document.body.classList.add");
    expect(cleaner).toContain('nav[aria-label="Global portal navigation"]');
    expect(feed).toContain("FypShellCleaner");
  });
});
