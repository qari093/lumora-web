import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { shouldRunFyp94Refresh } from "../../src/lib/fyp94/auto-refresh/policy";
import {
  splitFyp94ArchiveWindow,
  validateFyp94Freshness,
} from "../../src/lib/fyp94/auto-refresh/archive";

describe("FYP94 Pack 10 — Auto Refresh Engine", () => {
  it("decides refresh schedule correctly", () => {
    expect(shouldRunFyp94Refresh({ lastRunAt: null })).toBe(true);

    expect(
      shouldRunFyp94Refresh({
        lastRunAt: "2026-01-01T00:00:00.000Z",
        now: new Date("2026-01-01T07:00:00.000Z"),
        everyHours: 6,
      }),
    ).toBe(true);
  });

  it("archives oldest clips and keeps storage cap", () => {
    const items = Array.from({ length: 5 }).map((_, index) => ({ id: index + 1 }));
    const out = splitFyp94ArchiveWindow(items, 3);

    expect(out.active.map((x) => x.id)).toEqual([3, 4, 5]);
    expect(out.archived.map((x) => x.id)).toEqual([1, 2]);
  });

  it("validates feed freshness", () => {
    const items = Array.from({ length: 35 }).map((_, index) => ({
      id: index + 1,
      source: "pexels",
      query: "city",
      localUrl: `/native-fyp/real/${index + 1}.mp4`,
    }));

    expect(validateFyp94Freshness(items).ok).toBe(true);
  });

  it("has executable refresh and cron scripts", () => {
    expect(fs.existsSync("scripts/fyp94/refresh_engine.mjs")).toBe(true);
    expect(fs.existsSync("scripts/fyp94/run_refresh_engine.sh")).toBe(true);
    expect(fs.existsSync("scripts/fyp94/cron_refresh_hint.sh")).toBe(true);

    const refresh = fs.readFileSync("scripts/fyp94/refresh_engine.mjs", "utf8");
    expect(refresh).toContain("FYP94_REFRESH_DONE");
    expect(refresh).toContain("maxManifestItems");
  });
});
