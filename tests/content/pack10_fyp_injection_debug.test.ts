import { describe, expect, it } from "vitest";
import { disableMultiSourceFyp, enableMultiSourceFyp, isMultiSourceFypEnabled } from "@/src/lib/content/fyp/multiSourceFlags";
import { normalizeMultiSourceForFyp } from "@/src/lib/content/fyp/multiSourceFeedNormalizer";
import { buildMultiSourceDebug, injectMultiSourceIntoFyp } from "@/src/lib/content/fyp/injectMultiSourceFyp";
import { ALL_SOURCE_ADAPTERS } from "@/src/lib/content/adapters/allAdapters";

describe("Lumora Pack 10 — FYP injection + debug + kill switch", () => {
  const sourceItems = [
    {
      id: "1",
      title: "NASA Clip",
      source: "NASA",
      license: "public domain",
      sourceUrl: "https://nasa.gov",
      playableUrl: "https://example.com/nasa.mp4",
      hasAudio: true,
      durationSeconds: 30,
    },
  ];

  it("toggles multi-source FYP", () => {
    disableMultiSourceFyp();
    expect(isMultiSourceFypEnabled()).toBe(false);
    enableMultiSourceFyp();
    expect(isMultiSourceFypEnabled()).toBe(true);
  });

  it("normalizes multi-source items for FYP", () => {
    const out = normalizeMultiSourceForFyp(sourceItems);
    expect(out).toHaveLength(1);
    expect(out[0].sourceType).toBe("multi-source");
    expect(out[0].hasAudio).toBe(true);
  });

  it("injects multi-source items before existing feed", () => {
    enableMultiSourceFyp();
    const out = injectMultiSourceIntoFyp([{ id: "old" }], sourceItems);
    expect(out[0].sourceType).toBe("multi-source");
  });

  it("debug reports source information", () => {
    const out = injectMultiSourceIntoFyp([], sourceItems);
    const debug = buildMultiSourceDebug(out);
    expect(debug.multiSourceCount).toBe(1);
    expect(debug.sources).toContain("NASA");
  });

  it("has adapter coverage and excludes restricted sources", () => {
    const ids = ALL_SOURCE_ADAPTERS.map((adapter) => adapter.id);
    expect(ids.length).toBeGreaterThanOrEqual(45);
    expect(ids).not.toContain("cern");
    expect(ids).not.toContain("open-planet");
  });
});
