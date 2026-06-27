import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace Ω∞ Code Pack 01/10 — Homecoming Ω", () => {
  it("creates Homecoming Omega component", () => {
    const src = fs.readFileSync("src/components/lumaspace/homecoming/HomecomingOmega.tsx", "utf8");
    expect(src).toContain("ls-homecoming-omega");
    expect(src).toContain("ls-blue-blade");
    expect(src).toContain("YOUR SPACE.");
    expect(src).toContain("YOUR PEOPLE.");
    expect(src).toContain("YOUR STORY.");
    expect(src).toContain("Welcome home.");
  });

  it("locks sacred timing and fade structure", () => {
    const css = fs.readFileSync("src/styles/lumaspace/homecoming-omega.css", "utf8");
    expect(css).toContain("ls-blade-rise");
    expect(css).toContain("ls-spark-ignite");
    expect(css).toContain("ls-word-in");
    expect(css).toContain("ls-whisper-in");
    expect(css).toContain("5.8s");
  });

  it("mounts Homecoming on Living Universe runtime", () => {
    const runtime = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");
    expect(runtime).toContain("HomecomingOmega");
  });

  it("keeps reduced motion safe", () => {
    const css = fs.readFileSync("src/styles/lumaspace/homecoming-omega.css", "utf8");
    expect(css).toContain("prefers-reduced-motion");
  });
});
