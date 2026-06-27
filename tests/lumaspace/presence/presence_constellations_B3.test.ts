import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  PresenceConstellations,
  validatePresenceConstellations
} from "@/src/core/lumaspace/presence/presenceConstellations";

describe("LumaSpace Ω∞ Mega Pack B3 — Presence Constellations", () => {
  it("locks ambient presence doctrine", () => {
    expect(validatePresenceConstellations()).toBe(true);
    expect(PresenceConstellations.doctrine).toContain("ambient art");
  });

  it("creates six living people stars", () => {
    expect(PresenceConstellations.people).toHaveLength(6);
    expect(PresenceConstellations.people.map((p) => p.world)).toEqual([
      "wonder",
      "dream",
      "creator",
      "gaming",
      "shadow",
      "calm"
    ]);
  });

  it("creates presence renderer", () => {
    const src = fs.readFileSync(
      "src/components/lumaspace/presence/PresenceConstellationField.tsx",
      "utf8"
    );
    expect(src).toContain("ls-presence-constellation-field");
    expect(src).toContain("ls-presence-star");
  });

  it("mounts presence renderer into runtime", () => {
    const runtime = fs.readFileSync(
      "src/components/lumaspace/runtime/LivingUniverseRuntime.tsx",
      "utf8"
    );
    expect(runtime).toContain("PresenceConstellationField");
  });

  it("keeps presence quiet and reduced-motion safe", () => {
    const css = fs.readFileSync(
      "src/styles/lumaspace/presence-constellations.css",
      "utf8"
    );
    expect(css).toContain("opacity: 0");
    expect(css).toContain("1px dashed");
    expect(css).toContain("6s");
    expect(css).toContain("prefers-reduced-motion");
  });
});
