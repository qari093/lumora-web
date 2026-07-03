import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("USL Mega Pack 02C — Share Demo Route", () => {
  it("creates the share route", () => {
    expect(fs.existsSync("app/share/page.tsx")).toBe(true);
    expect(fs.existsSync("app/share/ShareDemoClient.tsx")).toBe(true);
  });

  it("mounts the production share provider and reusable triggers", () => {
    const source = fs.readFileSync("app/share/ShareDemoClient.tsx", "utf8");

    expect(source).toContain("UniversalShareProvider");
    expect(source).toContain("UniversalShareButton");
    expect(source).toContain("UniversalShareFab");
    expect(source).toContain('data-testid="usl-share-demo-page"');
    expect(source).toContain('data-testid="usl-toggle-fab"');
    expect(source).toContain("favoriteDestinationIds");
    expect(source).toContain("recentDestinationIds");
  });
});
