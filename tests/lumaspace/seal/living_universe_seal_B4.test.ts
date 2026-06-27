import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  LivingUniverseSeal,
  validateLivingUniverseSeal
} from "@/src/core/lumaspace/seal/livingUniverseSeal";

describe("LumaSpace Ω∞ Mega Pack B4 — Core Visual Seal", () => {
  it("locks living universe seal", () => {
    expect(validateLivingUniverseSeal()).toBe(true);
    expect(LivingUniverseSeal.completedSteps).toBe("61-120");
  });

  it("keeps YOU dominant", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe-composer.css", "utf8");
    expect(css).toContain("width: 118px");
    expect(css).toContain("0 0 96px");
  });

  it("keeps world labels hidden by default", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe-composer.css", "utf8");
    expect(css).toContain("opacity: 0 !important");
    expect(css).toContain(":focus-visible");
    expect(css).toContain(":active");
  });

  it("keeps environmental worlds alive", () => {
    const css = fs.readFileSync("src/styles/lumaspace/environmental-worlds.css", "utf8");
    expect(css).toContain("lsWorldInnerLife");
    expect(css).toContain("mix-blend-mode: screen");
  });

  it("keeps presence quiet", () => {
    const css = fs.readFileSync("src/styles/lumaspace/presence-constellations.css", "utf8");
    expect(css).toContain("opacity: 0 !important");
  });
});
