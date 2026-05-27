import { describe, expect, it } from "vitest";
import { ALL_SOURCE_ADAPTERS, fetchFromAllAdapters } from "@/src/lib/content/adapters/allAdapters";

describe("Lumora Pack 08 — remaining approved source adapters", () => {
  it("expands adapter coverage near full approved source set", () => {
    expect(ALL_SOURCE_ADAPTERS.length).toBeGreaterThanOrEqual(45);
  });

  it("includes stock, mixed-license, and regional sources", () => {
    const ids = ALL_SOURCE_ADAPTERS.map((x) => x.id);

    expect(ids).toContain("pexels");
    expect(ids).toContain("pixabay");
    expect(ids).toContain("mazwai");
    expect(ids).toContain("videvo");
    expect(ids).toContain("aljazeera");
    expect(ids).toContain("nhk");
    expect(ids).toContain("nfsa");
  });

  it("does not include rejected restricted sources", () => {
    const ids = ALL_SOURCE_ADAPTERS.map((x) => x.id);

    expect(ids).not.toContain("open-planet");
    expect(ids).not.toContain("cern");
  });

  it("fetches normalized audio-positive clips", async () => {
    const clips = await fetchFromAllAdapters();

    expect(clips.length).toBeGreaterThanOrEqual(45);
    expect(clips.every((clip) => clip.hasAudio === true)).toBe(true);
    expect(clips.every((clip) => Boolean(clip.playableUrl))).toBe(true);
  });
});
