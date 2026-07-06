import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  canUserOwnUniverse,
  getSovereigntyPromise,
  sovereigntyItems
} from "@/src/core/lumaspace/sovereignty/runtime";

describe("LumaSpace Ω∞ Mega Pack 07 — Final Universe Seal", () => {
  it("has prior mega locks", () => {
    for (const n of ["01", "03", "04", "05", "06"]) {
      expect(fs.existsSync(`.lumaspace_mega${n}_lock`)).toBe(true);
    }
    expect(
      fs.existsSync(".lumaspace_mega02_lock") ||
      fs.existsSync(".lumora/audits/lumaspace_mega02_living_universe.json")
    ).toBe(true);
  });

  it("locks data sovereignty", () => {
    expect(sovereigntyItems.length).toBe(4);
    expect(canUserOwnUniverse()).toBe(true);
    expect(getSovereigntyPromise()).toContain("belongs to you");
  });

  it("keeps LumaSpace mounted and human-first", () => {
    const page = fs.readFileSync("app/lumaspace/page.tsx", "utf8");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).toContain("LivingUniverseRuntime");
    expect(page).not.toMatch(/followers|likes|views|rank/i);
  });

  it("creates final sovereignty UI surface", () => {
    expect(fs.existsSync("src/core/lumaspace/sovereignty/runtime.ts")).toBe(true);
    expect(fs.existsSync("src/components/lumaspace/runtime/LivingUniverseRuntime.tsx")).toBe(true);
  });
});
