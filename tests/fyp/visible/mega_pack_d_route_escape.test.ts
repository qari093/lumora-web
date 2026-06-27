import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Mega Pack D — Route Escape", () => {
  const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");
  const beacon = fs.readFileSync("components/home-beacon/HomeBeacon.tsx", "utf8");
  const player = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("GlobalPortalNav returns null on /fyp", () => {
    expect(nav).toContain("usePathname");
    expect(nav).toContain('pathname === "/fyp"');
    expect(nav).toContain("return null");
  });

  it("HomeBeacon returns null on /fyp", () => {
    expect(beacon).toContain("usePathname");
    expect(beacon).toContain('pathname === "/fyp"');
    expect(beacon).toContain("return null");
  });

  it("FYP player remains fullscreen and above shell", () => {
    expect(player).toContain("fixed inset-0");
    expect(player).toContain("z-[2147483647]");
    expect(player).toContain("h-[100svh]");
  });
});
