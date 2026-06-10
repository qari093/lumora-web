import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  fullscreenSourceFeed,
  getFullscreenSourceFeedSummary
} from "../../src/core/fyp/fullscreenSourceFeed";

describe("FYP fullscreen native autoplay feed", () => {
  it("uses 48 full-screen source cards with direct native videos", () => {
    const summary = getFullscreenSourceFeedSummary();

    expect(summary.status).toBe("FYP_FULLSCREEN_NATIVE_AUTOPLAY_READY");
    expect(summary.itemCount).toBe(48);
    expect(summary.sourceCount).toBe(48);
    expect(summary.directVideoAssets).toBeGreaterThanOrEqual(10);
    expect(fullscreenSourceFeed.every((item) => item.videoUrl.endsWith(".mp4"))).toBe(true);
  });

  it("uses native video autoplay instead of YouTube iframe windows", () => {
    const component = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(component).toContain("<video");
    expect(component).toContain("playsInline");
    expect(component).toContain("node.play()");
    expect(component).toContain("IntersectionObserver");
    expect(component).not.toContain("<iframe");
    expect(component).not.toContain("youtube-nocookie.com/embed");
  });

  it("forces full mobile screen experience", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).toContain("height: 100svh");
    expect(css).toContain("scroll-snap-type: y mandatory");
    expect(css).toContain("object-fit: cover");
    expect(css).toContain(".rightRail");
    expect(css).toContain(".tiktokBottom");
  });
});
