import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Content Engine Pack10 — FYP Dynamic Source Replacement", () => {
  it("loads feed from content engine API and passes it into FYP player", () => {
    const feed = fs.readFileSync("components/fyp/FypContentEngineFeed.tsx", "utf8");
    const player = fs.readFileSync("components/fyp/FypFullPlayer.tsx", "utf8");
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");

    expect(feed).toContain("/api/content-engine/feed");
    expect(feed).toContain("externalItems");
    expect(feed).toContain("feedStatus");

    expect(player).toContain("externalItems");
    expect(player).toContain("fallbackVideos");
    expect(player).toContain("poster={item.thumbnailUrl}");
    expect(player).toContain("FypRuntimeVideoSignalBridge");
    expect(player).toContain("🔇 Sound");
    expect(player).toContain('type="range"');
    expect(player).toContain("seek(-5)");
    expect(player).toContain("seek(5)");

    expect(page).toContain("FypContentEngineFeed");
  });
});
