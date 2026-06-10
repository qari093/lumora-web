import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP visual playback compact overlay", () => {
  const component = fs.readFileSync("app/fyp/FypAutoplayFeed.tsx", "utf8");
  const css = fs.readFileSync("app/fyp/styles.module.css", "utf8");

  it("uses native autoplay videos with eager preload", () => {
    expect(component).toContain("autoPlay");
    expect(component).toContain('preload="auto"');
    expect(component).toContain('data-fyp-runtime="fullscreen-native-autoplay"');
  });

  it("removes oversized title copy and uses compact creator strip", () => {
    expect(component).toContain("creatorStrip");
    expect(css).toContain(".creatorStrip");
    expect(css).toContain(".videoInfo h1");
    expect(css).toContain("display: none !important");
  });

  it("forces true full-screen cover video rendering", () => {
    expect(css).toContain("object-fit: cover !important");
    expect(css).toContain("width: 100% !important");
    expect(css).toContain("height: 100% !important");
    expect(css).toContain("filter: none !important");
  });
});
