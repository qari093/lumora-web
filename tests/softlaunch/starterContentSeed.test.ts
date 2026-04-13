import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateStarterContentSeed } from "@/lib/softlaunch/starterContentSeed";

describe("soft-launch starter content seed", () => {
  it("passes valid starter seed coverage", () => {
    const items = JSON.parse(fs.readFileSync("data/softlaunch/starter-content.json", "utf8"));
    const out = evaluateStarterContentSeed({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.seed.total).toBe(6);
      expect(out.seed.active).toBe(6);
      expect(out.seed.portalsCovered).toBe(6);
      expect(out.seed.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateStarterContentSeed({
      items: [
        { id: "x", portal: "FYP", title: "A", category: "feed", active: true },
        { id: "x", portal: "GMAR", title: "B", category: "game", active: true }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid portal", () => {
    const out = evaluateStarterContentSeed({
      items: [
        { id: "x", portal: "BAD", title: "A", category: "feed", active: true }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_portal" });
  });

  it("rejects missing items", () => {
    const out = evaluateStarterContentSeed({ items: [] });
    expect(out).toEqual({ ok: false, reason: "missing_items" });
  });
});
