import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createWorldRipple,
  getCircleById,
  getSharedWorldsForCircle,
  lumaCircles,
  sharedWorlds
} from "@/src/core/lumaspace/people/runtime";

describe("LumaSpace Ω∞ Mega Pack 04 — People & Shared Universes", () => {
  it("locks sovereign people circles", () => {
    expect(lumaCircles.length).toBeGreaterThanOrEqual(4);
    expect(getCircleById("closest").name).toBe("Closest Circle");
    expect(JSON.stringify(lumaCircles)).not.toMatch(/followers|likes|views/i);
  });

  it("locks shared worlds", () => {
    expect(sharedWorlds.length).toBeGreaterThanOrEqual(2);
    expect(getSharedWorldsForCircle("closest").length).toBeGreaterThan(0);
  });

  it("locks world ripples as ambient presence", () => {
    const ripple = createWorldRipple("Ayesha", "calm");
    expect(ripple.message).toContain("calm ripple");
    expect(ripple.message).toContain("Ayesha");
  });

  it("creates canonical People & Shared Universes UI surface", () => {
    expect(fs.existsSync("src/core/lumaspace/people/runtime.ts")).toBe(true);
    expect(fs.existsSync("src/components/lumaspace/people/LumaPeopleUniverse.tsx")).toBe(true);
  });
});
