import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP autoplay scroll feed", () => {
  it("uses a client autoplay feed component", () => {
    const file = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");

    expect(file).toContain('"use client"');
    expect(file).toContain("IntersectionObserver");
    expect(file).toContain("autoplay");
    expect(file).toContain("mute");
    expect(file).toContain("playsinline");
    expect(file).toContain("youtube-nocookie.com/embed");
  });

  it("keeps the route clean and delegates to autoplay feed", () => {
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");

    expect(page).toContain("FypAutoplayFeed");
    expect(page).not.toContain("Loading FYP");
  });

  it("has mobile player styles", () => {
    const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

    expect(css).toContain(".playerShell");
    expect(css).toContain(".videoFrame");
    expect(css).toContain(".cardActive");
  });
});
