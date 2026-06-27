import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ Living Universe Runtime Final Seal", () => {
  it("mounts the immersive runtime page", () => {
    const page = fs.readFileSync("app/lumaspace/page.tsx", "utf8");
    expect(page).toContain("LivingUniverseRuntime");
  });

  it("keeps core visual layers", () => {
    const runtime = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");
    expect(runtime).toContain("lumaspace-worlds-layer");
    expect(runtime).toContain("lumaspace-pulse-layer");
    expect(runtime).toContain("lumaspace-garden-layer");
    expect(runtime).toContain("lumaspace-reaction-galaxy");
    expect(runtime).toContain("lumaspace-story-constellation");
    expect(runtime).toContain("lumaspace-mask-button");
  });

  it("keeps iPhone safe-area polish", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");
    expect(css).toContain("100svh");
    expect(css).toContain("100dvh");
    expect(css).toContain("env(safe-area-inset-top)");
    expect(css).toContain("env(safe-area-inset-bottom)");
  });

  it("does not expose placeholder card dashboard language", () => {
    const page = fs.readFileSync("app/lumaspace/page.tsx", "utf8");
    expect(page).not.toMatch(/card-based|placeholder|dashboard/i);
  });
});
