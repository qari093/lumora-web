import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  getMaskAtmosphere,
  isSanctuarySafeTransition,
  maskAtmospheres
} from "@/src/core/lumaspace/mask/maskMode";

describe("LumaSpace Ω∞ Mega Pack E — Sanctuary Final Seal Ω", () => {
  it("locks mask atmosphere modes", () => {
    expect(getMaskAtmosphere("public").label).toBe("Public Self");
    expect(getMaskAtmosphere("inner").label).toBe("Inner Self");
    expect(maskAtmospheres.inner.youGlow).toBe("amber");
    expect(maskAtmospheres.public.youGlow).toBe("cyan");
  });

  it("keeps Mask transition sanctuary-safe", () => {
    expect(isSanctuarySafeTransition(getMaskAtmosphere("public"))).toBe(true);
    expect(isSanctuarySafeTransition(getMaskAtmosphere("inner"))).toBe(true);
  });

  it("locks final visual hierarchy and sovereign pill", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");
    expect(css).toContain("lumaspace-mask-button:active");
    expect(css).toContain("scale(.95)");
    expect(css).toContain("amber");
    expect(css).toContain("ls-sovereign-universe::after");
    expect(css).toContain("display: none !important");
  });

  it("keeps iPhone final polish and reduced-motion safety", () => {
    const css = fs.readFileSync("src/styles/lumaspace/living-universe.css", "utf8");
    expect(css).toContain("overscroll-behavior: none");
    expect(css).toContain("-webkit-touch-callout: none");
    expect(css).toContain("max-width: 480px");
    expect(css).toContain("prefers-reduced-motion");
  });
});
