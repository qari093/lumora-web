import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { validateSeedPlan } from "@/lib/softlaunch/contentSeed";

describe("soft-launch initial content seeding", () => {
  it("validates the initial seed catalog", () => {
    const items = JSON.parse(
      fs.readFileSync("data/softlaunch/initial-content.json", "utf8")
    );

    const out = validateSeedPlan({ items });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.summary.total).toBe(7);
      expect(out.summary.active).toBe(7);
      expect(out.summary.byPortal.FYP).toBe(2);
      expect(out.summary.byPortal.GMAR).toBe(1);
      expect(out.summary.byPortal.NEXA).toBe(1);
      expect(out.summary.byPortal.LIVE).toBe(1);
      expect(out.summary.byPortal.MOVIES).toBe(1);
      expect(out.summary.byPortal.MUSIC).toBe(1);
    }
  });

  it("rejects duplicate ids", () => {
    const out = validateSeedPlan({
      items: [
        { id: "x", portal: "FYP", title: "A", kind: "video", active: true },
        { id: "x", portal: "GMAR", title: "B", kind: "drop", active: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid portal", () => {
    const out = validateSeedPlan({
      items: [
        { id: "x", portal: "BAD" as any, title: "A", kind: "video", active: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_portal" });
  });

  it("rejects missing items", () => {
    const out = validateSeedPlan({ items: [] });
    expect(out).toEqual({ ok: false, reason: "missing_items" });
  });
});
