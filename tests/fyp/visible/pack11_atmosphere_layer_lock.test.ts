import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 11 — Atmosphere Layer Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps atmospheric overlay above video", () => {
    expect(src).toContain("radial-gradient(circle at 80% 80%");
    expect(src).toContain("radial-gradient(circle at 20% 20%");
    expect(src).toContain("linear-gradient(180deg");
    expect(src).toContain("pointerEvents: \"none\"");
  });

  it("keeps cinematic darkening for readable UI", () => {
    expect(src).toContain("rgba(0,0,0,.72)");
    expect(src).toContain("rgba(0,0,0,.96)");
  });

  it("keeps overlay layering safe", () => {
    expect(src).toContain("zIndex: 2");
    expect(src).toContain("zIndex: 10");
    expect(src).toContain("zIndex: 11");
  });

  it("keeps performance-safe inline atmosphere only", () => {
    expect(src).not.toContain("filter: \"blur");
    expect(src).not.toContain("backdropFilter: \"blur(80px)");
  });
});
