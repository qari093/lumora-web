import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("portal link integrity suite", () => {
  it("home hub links match portal registry", () => {
    const home = fs.readFileSync("components/home/HomePortalHub.tsx", "utf8");
    const cards = fs.readFileSync("lib/portal/getPortalCards.ts", "utf8");

    for (const key of ["fyp", "gmar", "nexa", "cineverse", "live", "wallet", "profile"]) {
      expect(cards.includes(`${key}:`)).toBe(true);
      expect(home.includes("href={card.path}")).toBe(true);
      expect(home.includes('data-home-portal-key={card.key}')).toBe(true);
    }
  });

  it("global nav links rely on manifest paths", () => {
    const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");
    const manifest = fs.readFileSync("lib/portal/getPortalStatusManifest.ts", "utf8");

    expect(nav.includes("href={item.path}")).toBe(true);
    expect(nav.includes('data-global-nav-key={item.key}')).toBe(true);

    for (const path of ["/fyp", "/gmar", "/nexa", "/cineverse", "/live", "/wallet", "/profile"]) {
      expect(manifest.includes(path)).toBe(true);
    }
  });

  it("registry page reflects card paths", () => {
    const registry = fs.readFileSync("app/portals/page.tsx", "utf8");
    expect(registry.includes("getPortalCards")).toBe(true);
    expect(registry.includes("card.path")).toBe(true);
    expect(registry.includes('data-registry-portal-key={card.key}')).toBe(true);
  });
});
