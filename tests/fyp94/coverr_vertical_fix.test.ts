import { describe, expect, it } from "vitest";
import { createFyp94SupplyClient } from "../../src/lib/fyp94/supply/clients";
import {
  filterFyp94VerticalMp4SupplyClips,
  isFyp94DurationSafe,
  isFyp94Mp4Clip,
  isFyp94VerticalClip,
} from "../../src/lib/fyp94/supply/verticalGuard";

describe("FYP94 Coverr vertical ingestion fix", () => {
  it("accepts only vertical MP4 clips with safe duration", () => {
    const clips = filterFyp94VerticalMp4SupplyClips([
      {
        externalId: "ok",
        source: "coverr",
        title: "ok",
        sourceUrl: "https://coverr.co/ok",
        mp4Url: "https://cdn.coverr.co/ok.mp4",
        width: 720,
        height: 1280,
        durationSeconds: 18,
        tags: ["vertical"],
      },
      {
        externalId: "bad_horizontal",
        source: "coverr",
        title: "bad",
        sourceUrl: "https://coverr.co/bad",
        mp4Url: "https://cdn.coverr.co/bad.mp4",
        width: 1280,
        height: 720,
        durationSeconds: 18,
        tags: ["horizontal"],
      },
      {
        externalId: "bad_webm",
        source: "coverr",
        title: "bad",
        sourceUrl: "https://coverr.co/bad",
        mp4Url: "https://cdn.coverr.co/bad.webm",
        width: 720,
        height: 1280,
        durationSeconds: 18,
        tags: ["webm"],
      },
    ]);

    expect(clips).toHaveLength(1);
    expect(clips[0].externalId).toBe("ok");
  });

  it("guards vertical, mp4, and duration independently", () => {
    expect(isFyp94VerticalClip({ width: 720, height: 1280 })).toBe(true);
    expect(isFyp94Mp4Clip({ mp4Url: "https://x.test/a.mp4?dl=1" })).toBe(true);
    expect(isFyp94DurationSafe({ durationSeconds: 18 })).toBe(true);
  });

  it("Coverr client returns vertical MP4-safe clips", async () => {
    const client = createFyp94SupplyClient("coverr");
    const clips = await client.search({ query: "adrenaline", limit: 3 });

    expect(clips.length).toBeGreaterThan(0);
    expect(clips.every((clip) => clip.source === "coverr")).toBe(true);
    expect(clips.every((clip) => clip.height! > clip.width!)).toBe(true);
    expect(clips.every((clip) => clip.mp4Url.includes(".mp4"))).toBe(true);
  });
});
