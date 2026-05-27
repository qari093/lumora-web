import { describe, expect, it } from "vitest";
import { ALL_SOURCE_ADAPTERS, fetchFromAllAdapters } from "@/src/lib/content/adapters/allAdapters";

describe("Lumora Pack 07 — source adapters", () => {
  it("registers adapter sources", () => {
    expect(ALL_SOURCE_ADAPTERS.length).toBeGreaterThanOrEqual(20);
  });

  it("includes required sources", () => {
    const ids = ALL_SOURCE_ADAPTERS.map((x) => x.id);
    expect(ids).toContain("nasa");
    expect(ids).toContain("internet-archive");
    expect(ids).toContain("wikimedia");
    expect(ids).toContain("padma");
  });

  it("fetches normalized clips", async () => {
    const clips = await fetchFromAllAdapters();
    expect(clips.length).toBeGreaterThan(0);
    expect(clips.every((clip) => clip.hasAudio === true)).toBe(true);
  });
});
