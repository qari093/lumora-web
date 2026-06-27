import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack 02 — Playback + DepthCanvas Enhanced", () => {
  it("uses the Omega player on the real /fyp route", () => {
    const page = fs.readFileSync("app/fyp/page.tsx", "utf8");

    expect(page).toContain("FypOmegaPlayer");
    expect(page).toContain("getProductionFypFeed");
  });

  it("adds iPhone-safe video playback attributes", () => {
    const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

    expect(player).toContain("playsInline");
    expect(player).toContain("muted");
    expect(player).toContain("autoPlay");
    expect(player).toContain("preload=\"metadata\"");
    expect(player).toContain("poster={item.media.posterUrl}");
  });

  it("adds retry-once and no-black-screen failure state", () => {
    const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

    expect(player).toContain("retryCount < 1");
    expect(player).toContain("fyp-beautiful-failure");
    expect(player).toContain("This Trace is still forming.");
  });

  it("adds complete visible DepthCanvas controls", () => {
    const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

    expect(player).toContain("fyp-omega-depthcanvas");
    expect(player).toContain("fyp-right-rail");
    expect(player).toContain("fyp-lane-pills");
    expect(player).toContain("fyp-trace-pulse");
    expect(player).toContain("fyp-curiosity-ring");
    expect(player).toContain("fyp-bottom-nav");
  });

  it("routes bottom nav to correct Lumora destinations", () => {
    const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

    expect(player).toContain('navigateTo("/")');
    expect(player).toContain('navigateTo("/fyp")');
    expect(player).toContain('navigateTo("/live")');
    expect(player).toContain('navigateTo("/lumaspace")');
    expect(player).toContain('navigateTo("trace")');
  });
});
