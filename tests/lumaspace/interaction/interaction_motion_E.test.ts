import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  InteractionLanguage,
  validateInteractionLanguage
} from "@/src/core/lumaspace/interaction/interactionLanguage";

const runtime = () =>
  fs.readFileSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx", "utf8");

describe("LumaSpace Ω∞ Mega Pack E — Actual Motion Runtime", () => {
  it("locks interaction language", () => {
    expect(validateInteractionLanguage()).toBe(true);
    expect(InteractionLanguage.doctrine).toContain("calm pool of water");
  });

  it("preserves all canonical runtime layers", () => {
    const s = runtime();

    for (const layer of InteractionLanguage.preservedLayers) {
      expect(s).toContain(layer);
    }

    expect(s).toContain("InteractionMotionField");
  });

  it("does not resurrect old prototype layers", () => {
    const s = runtime();

    expect(s).not.toContain("lumaspace-worlds-layer");
    expect(s).not.toContain("lumaspace-pulse-layer");
    expect(s).not.toContain("lumaspace-garden-layer");
    expect(s).not.toContain("lumaspace-runtime-center");
    expect(s).not.toContain("LivingGlassWorlds");
    expect(s).not.toContain("LivingYouStar");
  });

  it("adds actual motion field component", () => {
    const src = fs.readFileSync(
      "src/components/lumaspace/interaction/InteractionMotionField.tsx",
      "utf8"
    );

    expect(src).toContain("ls-interaction-motion-field");
    expect(src).toContain("ls-motion-current");
  });

  it("adds living motion css", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/interaction-motion-field.css",
      "utf8"
    );

    expect(css).toContain("lsYouLivingHeartbeat");
    expect(css).toContain("lsPresenceOrganicOrbit");
    expect(css).toContain("lsTraceDashDrift");
    expect(css).toContain("lsMotionCurrentDrift");
    expect(css).toContain("prefers-reduced-motion");
  });
});
