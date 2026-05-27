import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 black screen diagnostic", () => {
  it("manifest has playable local files", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    const local = manifest.filter((x: any) => x.localUrl && fs.existsSync(`public${x.localUrl}`));

    expect(manifest.length).toBeGreaterThan(0);
    expect(local.length).toBeGreaterThan(0);
  });

  it("library route preserves playbackUrl field", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("playbackUrl");
    expect(route).toContain("mapFyp94CdnPlaybackUrl");
  });

  it("quality gate cannot return empty when local videos exist", async () => {
    const { buildFyp94QualityMixedFeed } = await import("../../src/lib/fyp94/quality/mixQualityGate");

    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    const mapped = manifest
      .filter((x: any) => x.localUrl && fs.existsSync(`public${x.localUrl}`))
      .slice(0, 50)
      .map((x: any, i: number) => ({
        id: `real_${x.id || i}`,
        source: x.source,
        sourceType: x.sourceType,
        contentMode: x.contentMode,
        query: x.query,
        title: x.title,
        hasAudio: x.hasAudio,
        hasVoice: x.hasVoice,
        humanScore: x.humanScore,
        motionScore: x.motionScore,
        duration: x.duration,
        localUrl: x.localUrl,
        mp4Url: x.mp4Url,
        playbackUrl: x.localUrl,
      }));

    const out = buildFyp94QualityMixedFeed(mapped, 20);

    expect(out.length).toBeGreaterThan(0);
    expect(out[0].playbackUrl || out[0].localUrl).toBeTruthy();
  });
});
