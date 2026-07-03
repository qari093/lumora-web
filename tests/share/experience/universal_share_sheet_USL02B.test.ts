import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("USL Mega Pack 02B — Universal Share Sheet UI", () => {
  it("creates the universal share sheet component", () => {
    const source = fs.readFileSync("src/components/share/UniversalShareSheet.tsx", "utf8");

    expect(source).toContain("UniversalShareSheet");
    expect(source).toContain("rankShareDestinations");
    expect(source).toContain("createUniversalShareIntent");
    expect(source).toContain("materializeShareIntent");
    expect(source).toContain('data-testid="usl-share-sheet"');
    expect(source).toContain('data-testid="usl-create-share"');
  });

  it("creates mobile-first share sheet styling", () => {
    const css = fs.readFileSync("src/components/share/universal-share-sheet.css", "utf8");

    expect(css).toContain(".usl-sheet-backdrop");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("@media (max-width: 560px)");
    expect(css).toContain("grid-template-columns: 1fr");
  });
});
