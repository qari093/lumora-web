// @ts-nocheck
import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";

const root = process.cwd();
const docsPath = join(root, "docs/emml.md");

describe("EMML Docs — Contract Guard", () => {
  it("should have the EMML docs file", () => {
    expect(existsSync(docsPath)).toBe(true);
  });

  it("should describe all core EMML endpoints", () => {
    const src = readFileSync(docsPath, "utf8");

    expect(src).toContain("/api/emml/indices");
    expect(src).toContain("/api/emml/heat");
    expect(src).toContain("/api/emml/assets");
    expect(src).toContain("/api/emml/state");
    expect(src).toContain("/api/emml/health");
    expect(src).toContain("/api/emml/chart");
  });

  it("should mention EMMLSnapshot and core models", () => {
    const src = readFileSync(docsPath, "utf8");

    expect(src).toContain("EMMLSnapshot");
    expect(src).toContain("EmmlIndex");
    expect(src).toContain("EmmlMarket");
    expect(src).toContain("EmmlAsset");
    expect(src).toContain("EmmlTick");
    expect(src).toContain("EmmlEvent");
  });
});
