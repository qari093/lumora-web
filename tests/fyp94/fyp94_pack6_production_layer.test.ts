import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { mapFyp94PlaybackUrl } from "../../src/lib/fyp94/production/storage";
import { getFyp94FeedHealth } from "../../src/lib/fyp94/production/health";

describe("FYP94 Pack 6 — Production Layer", () => {
  it("has CDN mapping with local fallback", () => {
    expect(mapFyp94PlaybackUrl("/native-fyp/real/1.mp4")).toContain("/native-fyp/real/1.mp4");
  });

  it("has feed health endpoint", () => {
    expect(fs.existsSync("app/api/fyp94/health/route.ts")).toBe(true);

    const health = getFyp94FeedHealth();
    expect(health.manifestCount).toBeGreaterThan(0);
    expect(health.playableCount).toBeGreaterThan(0);
  });

  it("has R2 migration prep and production docs", () => {
    expect(fs.existsSync("scripts/fyp94/r2_migration_plan.sh")).toBe(true);

    const doc = fs.readFileSync("docs/fyp94/PRODUCTION_LAYER.md", "utf8");
    expect(doc).toContain("R2 migration prep");
    expect(doc).toContain("CDN URL mapping");
    expect(doc).toContain("fallback local mode");
    expect(doc).toContain("final production seal");
  });
});
