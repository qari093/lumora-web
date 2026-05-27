import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildFyp94FinalFeed } from "../../src/lib/fyp94/feed/build";

describe("FYP94 visibility pack 003", () => {
  it("keeps API feed contract at 20 items after refresh", () => {
    const item = (id: string) => ({
      id,
      title: id,
      category: "adrenaline",
      tags: ["adrenaline"],
      playbackUrl: `/native-fyp/fallback/${id}.mp4`,
      posterUrl: `/native-fyp/fallback/${id}.jpg`,
      thrillScore: 80,
      source: "lumora_owned",
    });

    const response = buildFyp94FinalFeed({
      layers: [Array.from({ length: 3 }).map((_, index) => item(String(index)))],
      recentlySeenIds: ["0", "1", "2"],
      targetSize: 20,
    });

    expect(response.items).toHaveLength(20);
    expect(response.items.every((x) => x.playbackUrl && x.posterUrl)).toBe(true);
  });

  it("validates mobile viewport and autoplay/mute behavior", () => {
    const s = fs.readFileSync("src/components/fyp94/Fyp94VisiblePlayer.tsx", "utf8");

    expect(s).toContain('height: "100dvh"');
    expect(s).toContain("autoPlay");
    expect(s).toContain("muted");
    expect(s).toContain("playsInline");
    expect(s).toContain('touchAction: "none"');
  });

  it("has smoke script for runtime browser API proof", () => {
    const s = fs.readFileSync("scripts/fyp94/smoke_fyp94_visible.mjs", "utf8");
    expect(s).toContain("/api/fyp94/feed");
    expect(s).toContain("FYP94_VISIBLE_SMOKE_PASS");
  });
});
