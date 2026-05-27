import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  blendZencasts,
  checkFeedAliveness,
  createZencast,
  sealContentEngine,
  validateNoEmptyFeed,
} from "@/src/content-engine/zencast";

describe("Content Engine Pack12 — Zencast Fallback + Final Seal", () => {
  it("checks feed aliveness and chooses zencast mode", () => {
    expect(checkFeedAliveness({ poolSize: 20, freshPoolSize: 10 }).zencastMode).toBe("off");
    expect(checkFeedAliveness({ poolSize: 5, freshPoolSize: 2 }).zencastMode).toBe("blend");
    expect(checkFeedAliveness({ poolSize: 0, freshPoolSize: 0 }).zencastMode).toBe("fallback");
  });

  it("creates Lumora zencast fallback content", () => {
    const z = createZencast({ seed: "abc", emotionalTone: "still" });

    expect(z.contentId).toBe("zencast_abc");
    expect(z.categoryTags).toContain("still");
    expect(z.generated).toBe(true);
  });

  it("blends zencasts without empty feed", () => {
    const fallback = blendZencasts({ items: [], mode: "fallback", seed: "x" });
    const blend = blendZencasts({
      items: [{ contentId: "a" }, { contentId: "b" }, { contentId: "c" }],
      mode: "blend",
      seed: "x",
    });

    expect(fallback).toHaveLength(1);
    expect(blend.some((item) => item.type === "zencast")).toBe(true);
  });

  it("validates no-empty-feed guarantee", () => {
    const result = validateNoEmptyFeed({
      items: [],
      poolSize: 0,
    });

    expect(result.ok).toBe(true);
    expect(result.items[0].type).toBe("zencast");
  });

  it("seals content engine and exposes alive API", () => {
    const seal = sealContentEngine();

    expect(seal.complete).toBe(true);
    expect(seal.totalSteps).toBe(60);
    expect(seal.totalPacks).toBe(12);
    expect(seal.lumoraAligned).toBe(true);
    expect(fs.existsSync("app/api/content-engine/alive/route.ts")).toBe(true);
  });
});
