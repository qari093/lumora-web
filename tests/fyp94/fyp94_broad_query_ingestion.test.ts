import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 broad query ingestion", () => {
  it("uses broad category query bank", () => {
    const script = fs.readFileSync("scripts/fyp94/append_paginated_pexels.mjs", "utf8");

    expect(script).toContain("football match");
    expect(script).toContain("basketball game");
    expect(script).toContain("street food");
    expect(script).toContain("animals funny");
    expect(script).toContain("city street");
    expect(script).toContain("cars driving");
  });

  it("manifest now contains broader query categories", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    const queries = new Set(manifest.map((x: any) => x.query));

    expect(manifest.length).toBeGreaterThanOrEqual(60);
    expect(queries.size).toBeGreaterThanOrEqual(4);
  });
});
