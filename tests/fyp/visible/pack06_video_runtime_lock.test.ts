import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 06 — Video Runtime Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps video runtime mounted and source-backed", () => {
    expect(src).toContain('data-testid="fyp-omega-video"');
    expect(src).toContain("src={videoUrl}");
    expect(src).toContain("poster={posterUrl}");
  });

  it("keeps mobile-native playback behavior", () => {
    expect(src).toContain("autoPlay");
    expect(src).toContain("muted");
    expect(src).toContain("loop");
    expect(src).toContain("playsInline");
    expect(src).toContain("preload=\"auto\"");
  });

  it("keeps browser controls disabled", () => {
    expect(src).toContain("controls={false}");
  });

  it("keeps edge-to-edge video fit", () => {
    expect(src).toContain('objectFit: "cover"');
    expect(src).toContain('objectPosition: "center"');
    expect(src).toContain('width: "100vw"');
    expect(src).toContain('height: "100svh"');
  });
});
