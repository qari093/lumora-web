import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("USL Mega Pack 02 Final — Provider and buttons", () => {
  it("creates app-level provider and hook", () => {
    const provider = fs.readFileSync("src/components/share/UniversalShareProvider.tsx", "utf8");

    expect(provider).toContain("UniversalShareProvider");
    expect(provider).toContain("useUniversalShare");
    expect(provider).toContain("lumora:share-created");
    expect(provider).toContain("UniversalShareSheet");
  });

  it("creates reusable button and FAB triggers", () => {
    const button = fs.readFileSync("src/components/share/UniversalShareButton.tsx", "utf8");
    const fab = fs.readFileSync("src/components/share/UniversalShareFab.tsx", "utf8");

    expect(button).toContain('data-testid="usl-share-button"');
    expect(button).toContain("openShare");
    expect(fab).toContain('data-testid="usl-share-fab"');
    expect(fab).toContain("favoriteDestinationIds");
  });
});
