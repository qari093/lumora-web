import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 01 — Existing Canvas Stabilization", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps the existing player as the canonical fullscreen canvas", () => {
    expect(src).toContain('data-testid="fyp-omega-depthcanvas"');
    expect(src).toContain('position: "fixed"');
    expect(src).toContain('width: "100vw"');
    expect(src).toContain('height: "100svh"');
    expect(src).toContain('isolation: "isolate"');
  });

  it("keeps video edge-to-edge and browser-control free", () => {
    expect(src).toContain('data-testid="fyp-omega-video"');
    expect(src).toContain('objectFit: "cover"');
    expect(src).toContain('playsInline');
    expect(src).toContain('controls={false}');
  });

  it("does not introduce a parallel canvas component", () => {
    expect(fs.existsSync("app/fyp/FypOmegaCanvas.tsx")).toBe(false);
  });

  it("does not contain app-side debug ghosts", () => {
    expect(src).not.toMatch(/>\s*N\s*</);
    expect(src).not.toContain("192.168");
  });
});
