import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Lumora visual runtime recovery", () => {
  it("homepage is a real private beta ecosystem hub", () => {
    const source = fs.readFileSync("app/page.tsx", "utf8");

    expect(source).toContain("Lumora Private Beta");
    expect(source).toContain("Your private beta ecosystem is alive.");
    expect(source).toContain("Create account");
    expect(source).toContain("Login");
    expect(source).toContain("portals.map");
    expect(source).not.toContain("Home ✅");
  });

  it("exposes core ecosystem journeys", () => {
    const source = fs.readFileSync("app/page.tsx", "utf8");

    for (const route of [
      "/fyp",
      "/live",
      "/gmar",
      "/lumaspace",
      "/lumexa/shop",
      "/movies",
      "/music",
      "/creator",
    ]) {
      expect(source).toContain(route);
    }
  });

  it("keeps external tester invitations deferred", () => {
    const source = fs.readFileSync("app/page.tsx", "utf8");

    expect(source).toContain(
      "before external testers are invited"
    );
  });
});
