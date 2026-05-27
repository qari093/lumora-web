import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  mapFyp94CdnPlaybackUrl,
  validateFyp94ProductionConfig,
} from "../../src/lib/fyp94/production2/config";
import { getFyp94ProductionHealth } from "../../src/lib/fyp94/production2/monitor";

describe("FYP94 Pack 14 — Production Layer Ready State", () => {
  it("maps CDN playback URL with local fallback", () => {
    expect(mapFyp94CdnPlaybackUrl("/native-fyp/real/1.mp4")).toContain(
      "/native-fyp/real/1.mp4",
    );

    expect(validateFyp94ProductionConfig().ok).toBe(true);
  });

  it("integrates CDN mapping into library API", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("mapFyp94CdnPlaybackUrl");
    expect(route).toContain("playbackUrl: mapFyp94CdnPlaybackUrl");
  });

  it("has production health endpoint and monitoring", () => {
    expect(fs.existsSync("app/api/fyp94/production-health/route.ts")).toBe(true);

    const health = getFyp94ProductionHealth();
    expect(health.manifestCount).toBeGreaterThan(0);
    expect(health.playableCount).toBeGreaterThan(0);
  });

  it("has production configuration docs", () => {
    const doc = fs.readFileSync("docs/fyp94/PRODUCTION_READY_STATE.md", "utf8");

    expect(doc).toContain("CDN mapping layer");
    expect(doc).toContain("local fallback mode");
    expect(doc).toContain("FYP94_STORAGE_MODE=r2");
    expect(doc).toContain("production health");
  });
});
