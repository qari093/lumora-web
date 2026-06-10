import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { fypFullscreenSources, getFypFullscreenSummary } from "../../src/core/fyp/fullscreenSourceFeed";

describe("FYP production playback engine", () => {
  it("uses 48 direct native video cards with real fullscreen playback fields", () => {
    expect(fypFullscreenSources).toHaveLength(48);
    expect(new Set(fypFullscreenSources.map((item) => item.sourceName)).size).toBe(48);
    expect(fypFullscreenSources.every((item) => item.videoUrl.endsWith(".mp4"))).toBe(true);
    expect(fypFullscreenSources.every((item) => item.posterUrl.startsWith("https://images.unsplash.com/"))).toBe(true);
  });

  it("uses active-video controller and not iframe embed windows", () => {
    const component = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(component).toContain("IntersectionObserver");
    expect(component).toContain("safePlay(video)");
    expect(component).toContain("pauseVideo(video)");
    expect(component).toContain("<video");
    expect(component).not.toContain("<iframe");
    expect(component).not.toContain("youtube-nocookie.com/embed");
  });

  it("uses full-screen focused CSS without blur filters or small-card layout", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).toContain("height: 100svh");
    expect(css).toContain("scroll-snap-type: y mandatory");
    expect(css).toContain("object-fit: cover");
    expect(css).toContain("filter: none");
    expect(css).toContain(".rightRail");
    expect(css).toContain(".tiktokBottom");
    expect(css).not.toContain("iframe");
    expect(css).not.toContain("blur(");
  });

  it("reports production-ready native autoplay summary", () => {
    const summary = getFypFullscreenSummary();

    expect(summary.status).toBe("FYP_FULLSCREEN_NATIVE_AUTOPLAY_READY");
    expect(summary.nativeVideo).toBe(true);
    expect(summary.iframe).toBe(false);
    expect(summary.mutedAutoplay).toBe(true);
    expect(summary.fullscreen).toBe(true);
    expect(summary.activeController).toBe(true);
    expect(summary.safeMode).toBe(true);
  });
});
