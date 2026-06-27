import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 08 — LumaSpace Integration Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps LumaSpace available in right rail and bottom nav", () => {
    expect(src).toContain("LumaSpace");
    expect(src).toContain('"Space"');
  });

  it("keeps the canonical LumaSpace star portal slot", () => {
    expect(src).toContain("data-lumaspace-star-portal-slot");
    expect(src).toContain('label === "LumaSpace" ? "ready" : undefined');
  });

  it("keeps LumaSpace represented by the space glyph key", () => {
    expect(src).toContain('"space", "LumaSpace"');
    expect(src).toContain('"space", "Space"');
    expect(src).toContain('name={String(icon) as any}');
  });

  it("keeps save-to-story wording ready through product copy", () => {
    expect(src).toContain("Genesis Collection");
    expect(src).not.toContain("Saved Successfully");
  });
});
