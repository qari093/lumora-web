import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  LivingUniverseCore,
  validateLivingUniverseCore
} from "@/src/core/lumaspace/universe/livingUniverseCore";

describe("LumaSpace Ω∞ Mega Pack B1 — Living Universe Core", () => {
  it("locks YOU-centered universe doctrine", () => {
    expect(validateLivingUniverseCore()).toBe(true);
    expect(LivingUniverseCore.center.id).toBe("YOU");
    expect(LivingUniverseCore.orbit.worlds).toHaveLength(6);
  });

  it("creates composer surface", () => {
    const src = fs.readFileSync("src/components/lumaspace/universe/LivingUniverseComposer.tsx", "utf8");
    expect(src).toContain("ls-living-universe-composer");
    expect(src).toContain("ls-composer-you");
    expect(src).toContain("Dream");
    expect(src).toContain("Calm");
  });

  it("mounts composer into runtime", () => {
    const runtime = fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");
    expect(runtime).toContain("LivingUniverseComposer");
  });

  it("keeps labels discovery-based", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe-composer.css", "utf8");
    expect(css).toContain("opacity: 0");
    expect(css).toContain(":focus-visible");
    expect(css).toContain(":active");
    expect(css).toContain("prefers-reduced-motion");
  });
});
