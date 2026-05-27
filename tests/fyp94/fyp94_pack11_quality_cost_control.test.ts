import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateLimits } from "../../src/lib/fyp94/quality2/limits";
import { dedupeManifest } from "../../src/lib/fyp94/quality2/dedupe";

describe("FYP94 Pack 11 — Quality + Cost Control", () => {
  it("validates video limits", () => {
    expect(
      validateLimits({
        duration: 10,
        sizeBytes: 2_000_000,
        width: 720,
        height: 1280,
      }),
    ).toBe(true);

    expect(
      validateLimits({
        duration: 100,
        sizeBytes: 20_000_000,
        width: 1920,
        height: 1080,
      }),
    ).toBe(false);
  });

  it("dedupes manifest entries", () => {
    const items = [
      { source: "pexels", sourceId: "1" },
      { source: "pexels", sourceId: "1" },
      { source: "pixabay", sourceId: "2" },
    ];

    expect(dedupeManifest(items)).toHaveLength(2);
  });

  it("has compression + quality scripts", () => {
    expect(fs.existsSync("scripts/fyp94/compress_720p_v2.sh")).toBe(true);
    expect(fs.existsSync("scripts/fyp94/quality_gate_v2.mjs")).toBe(true);
  });
});
