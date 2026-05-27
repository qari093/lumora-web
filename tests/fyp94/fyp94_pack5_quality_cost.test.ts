import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  validateFyp94Duration,
  validateFyp94FileSize,
  validateFyp94Resolution,
} from "../../src/lib/fyp94/quality/limits";
import {
  createFyp94DuplicateKey,
  dedupeFyp94Manifest,
} from "../../src/lib/fyp94/quality/duplicate";
import { validateFyp94PlaybackPerformance } from "../../src/lib/fyp94/quality/performance";

describe("FYP94 Pack 5 — Quality + Cost Control", () => {
  it("validates duration cap", () => {
    expect(validateFyp94Duration({ duration: 10 }).ok).toBe(true);
    expect(validateFyp94Duration({ duration: 120 }).ok).toBe(false);
  });

  it("validates file size and vertical resolution caps", () => {
    expect(validateFyp94FileSize({ sizeBytes: 2_000_000 }).ok).toBe(true);
    expect(validateFyp94FileSize({ sizeBytes: 20_000_000 }).ok).toBe(false);

    expect(validateFyp94Resolution({ width: 720, height: 1280 }).ok).toBe(true);
    expect(validateFyp94Resolution({ width: 1920, height: 1080 }).ok).toBe(false);
  });

  it("dedupes manifest by source/sourceId or URL", () => {
    const items = [
      { source: "pexels", sourceId: "1", mp4Url: "a" },
      { source: "pexels", sourceId: "1", mp4Url: "b" },
      { source: "pixabay", sourceId: "2", mp4Url: "c" },
    ];

    expect(createFyp94DuplicateKey(items[0])).toBe("pexels:1");
    expect(dedupeFyp94Manifest(items)).toHaveLength(2);
  });

  it("validates playback performance budget", () => {
    expect(validateFyp94PlaybackPerformance({ startupMs: 800 }).ok).toBe(true);
    expect(validateFyp94PlaybackPerformance({ startupMs: 1500 }).ok).toBe(false);
  });

  it("has compression path and quality gate", () => {
    expect(fs.existsSync("scripts/fyp94/compress_720p_hint.sh")).toBe(true);
    expect(fs.existsSync("scripts/fyp94/quality_gate.mjs")).toBe(true);

    const doc = fs.readFileSync("docs/fyp94/QUALITY_COST_CONTROL.md", "utf8");
    expect(doc).toContain("720p compression path");
    expect(doc).toContain("duplicate guard");
  });
});
