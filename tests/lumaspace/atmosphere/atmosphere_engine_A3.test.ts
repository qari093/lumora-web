import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  LumaAtmosphereEngine,
  validateLumaAtmosphereEngine
} from "@/src/core/lumaspace/atmosphere/atmosphereEngine";

describe("LumaSpace Ω∞ Mega Pack A3 — Atmosphere Engine", () => {
  it("locks atmosphere doctrine", () => {
    expect(validateLumaAtmosphereEngine()).toBe(true);
    expect(LumaAtmosphereEngine.doctrine).toContain("Atmosphere before interface");
  });

  it("creates atmosphere component", () => {
    const src = fs.readFileSync("src/components/lumaspace/atmosphere/LumaAtmosphereEngine.tsx", "utf8");
    expect(src).toContain("ls-atmosphere-engine");
    expect(src).toContain("ls-atmosphere-nebula");
    expect(src).toContain("ls-atmosphere-stars");
    expect(src).toContain("ls-atmosphere-breath");
  });

  it("mounts atmosphere into runtime", () => {
    const runtime = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");
    expect(runtime).toContain("LumaAtmosphereEngine");
  });

  it("keeps motion serenity-safe", () => {
    const css = fs.readFileSync("src/styles/lumaspace/lumaspace-atmosphere-omega.css", "utf8");
    expect(css).toContain("28s");
    expect(css).toContain("36s");
    expect(css).toContain("12s");
    expect(css).toContain("prefers-reduced-motion");
  });
});
