import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace F5.7 — Hide global HomeBeacon on LumaSpace", () => {
  it("disables HomeBeacon on LumaSpace without removing it globally", () => {
    const source = fs.readFileSync("components/home-beacon/HomeBeacon.tsx", "utf8");

    expect(source).toContain('pathname === "/lumaspace"');
    expect(source).toContain('pathname?.startsWith("/lumaspace/")');
    expect(source).toContain('pathname === "/fyp"');
    expect(source).toContain('return null');
  });
});
