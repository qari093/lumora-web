import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(path, "utf8");
}

describe("Mega Step 26 reachable production reality closure", () => {
  it("removes caller-controlled identity and price selection from ZenShop", () => {
    const client = source("app/shop/ShopClient.tsx");
    const route = source("app/api/shop/order/route.ts");

    expect(client).not.toMatch(/demo-user|setUserId|User ID/);
    expect(client).not.toMatch(/setPriceId|Stripe Price ID/);
    expect(route).toContain("requireUserSession");
    expect(route).toContain("process.env.STRIPE_PRICE_ID");
    expect(route).not.toContain("const { priceId } = body");
  });

  it("connects Videos to the existing runtime", () => {
    const text = source("app/videos/page.tsx");

    expect(text).toContain("getVideosHealth");
    expect(text).toContain('href="/fyp"');
    expect(text).not.toContain("Portal placeholder");
  });

  it("connects Hybrid to existing avatar and emoji runtimes", () => {
    const text = source("app/hybrid/page.tsx");

    expect(text).toContain("StatusBadge");
    expect(text).toContain("/avatar-lab");
    expect(text).toContain("/emoji-lab");
    expect(text).not.toContain("Hybrid playground placeholder");
  });

  it("connects Trending to the real Google Trends runtime", () => {
    const text = source("app/trending/page.tsx");

    expect(text).toContain("/api/live/google-trends");
    expect(text).not.toContain("Wire real UI later");
  });

  it("connects Lumen to the existing Lumen runtime", () => {
    const text = source("app/lumen/page.tsx");

    expect(text).toContain("getLumenCoreEvolutionHooks");
    expect(text).toContain("/nexa");
    expect(text).toContain("/lumexa");
    expect(text).not.toContain("Placeholder page");
  });

  it("hands the old personal-space shell to canonical LumaSpace", () => {
    const text = source("app/me/space/page.tsx");

    expect(text).toContain('redirect("/lumaspace")');
    expect(text).not.toContain("My space placeholder");
  });

  it("hands movie playback to CineVerse instead of rendering a fake player", () => {
    const text = source("app/movies/watch/page.tsx");

    expect(text).toContain("/cineverse");
    expect(text).not.toContain("placeholder playback surface");
    expect(text).not.toContain("Seed player");
  });
});
