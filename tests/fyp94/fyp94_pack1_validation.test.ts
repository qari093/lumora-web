import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 Pack 1 — Source Variety Core", () => {
  it("has round-robin query module", () => {
    const s = fs.readFileSync("scripts/fyp94/queries.mjs", "utf8");
    expect(s).toContain("roundRobinQuery");
    expect(s).toContain("football match");
    expect(s).toContain("basketball game");
  });

  it("has per-query cap and spread validation", () => {
    const s = fs.readFileSync("scripts/fyp94/balance.mjs", "utf8");
    expect(s).toContain("MAX_PER_QUERY");
    expect(s).toContain("enforcePerQueryCap");
    expect(s).toContain("validateCategorySpread");
  });

  it("manifest contains balanced new category spread", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    const balanced = manifest.filter((x: any) => String(x.mp4Url || "").startsWith("balanced://"));

    expect(balanced.length).toBeGreaterThanOrEqual(20);

    const counts: Record<string, number> = {};
    for (const item of balanced) {
      counts[item.query] = (counts[item.query] || 0) + 1;
    }

    expect(Object.keys(counts).length).toBeGreaterThanOrEqual(8);
    expect(Math.max(...Object.values(counts))).toBeLessThanOrEqual(5);
  });
});
