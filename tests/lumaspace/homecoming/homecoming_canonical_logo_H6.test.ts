import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace H6 — canonical homecoming logo", () => {
  it("uses the Lumora brand asset instead of inline fake blade svg", () => {
    const source = fs.readFileSync("src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx", "utf8");
    expect(source).toContain('src="/brand/lumora-brand-v2.png"');
    expect(source).not.toContain("lsHomecomingBladeGradient");
  });

  it("removes the blue dot beside YOUR SPACE", () => {
    const source = fs.readFileSync("src/components/lumaspace/homecoming/HomecomingRitualOmega.tsx", "utf8");
    expect(source).toContain('<span className="space">YOUR SPACE.</span>');
    expect(source).not.toContain("ls-homecoming-blue-dot\" aria-hidden");
  });
});
