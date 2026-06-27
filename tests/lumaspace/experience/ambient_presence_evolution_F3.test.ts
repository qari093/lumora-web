import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  AmbientPresenceEvolution,
  validateAmbientPresenceEvolution
} from "@/src/core/lumaspace/experience/ambientPresenceEvolution";

const runtime = () =>
  fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");

describe("LumaSpace Ω∞ F3 — Ambient Presence Evolution", () => {
  it("locks ambient presence doctrine", () => {
    expect(validateAmbientPresenceEvolution()).toBe(true);
    expect(AmbientPresenceEvolution.doctrine).toContain("quiet companionship");
  });

  it("mounts ambient presence without dropping canonical runtime layers", () => {
    const s = runtime();

    for (const layer of AmbientPresenceEvolution.preservedRuntimeLayers) {
      expect(s).toContain(layer);
    }

    expect(s).toContain("AmbientPresenceEvolutionLayer");
  });

  it("does not resurrect legacy prototype layers", () => {
    const s = runtime();

    expect(s).not.toContain("lumaspace-worlds-layer");
    expect(s).not.toContain("lumaspace-pulse-layer");
    expect(s).not.toContain("lumaspace-garden-layer");
    expect(s).not.toContain("lumaspace-story-constellation");
    expect(s).not.toContain("lumaspace-reaction-galaxy");
    expect(s).not.toContain("lumaspace-runtime-center");
    expect(s).not.toContain("LivingGlassWorlds");
    expect(s).not.toContain("LivingYouStar");
  });

  it("creates ambient relationship animation css", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/ambient-presence-evolution-f3.css",
      "utf8"
    );

    expect(css).toContain("lsF3PresenceDrift");
    expect(css).toContain("lsF3PresencePulse");
    expect(css).toContain("lsF3EchoRing");
    expect(css).toContain("lsF3TraceBreathe");
    expect(css).toContain("prefers-reduced-motion");
  });
});
