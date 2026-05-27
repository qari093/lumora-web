import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildFyp94NoCacheHeaders } from "../../src/lib/fyp94/api-stability/headers";
import {
  filterFyp94PlayableManifest,
  readFyp94Manifest,
} from "../../src/lib/fyp94/api-stability/manifest";

describe("FYP94 Pack 13 — Feed API Stabilization", () => {
  it("uses manifest-only serving and no filesystem directory scan", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("readFyp94Manifest");
    expect(route).toContain("filterFyp94PlayableManifest");
    expect(route).not.toContain("readdirSync");
  });

  it("enforces fresh no-cache API response", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("fresh: true");
    expect(route).toContain("servedAt");
    expect(route).toContain("buildFyp94NoCacheHeaders");
    expect(buildFyp94NoCacheHeaders()["cache-control"]).toContain("no-store");
  });

  it("keeps all prior feed intelligence layers integrated", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");

    expect(route).toContain("enforceFyp94Diversity");
    expect(route).toContain("mixFyp94Lanes");
    expect(route).toContain("mixFyp94TimeMachine");
    expect(route).toContain("injectFyp94Wildcard");
  });

  it("validates manifest helpers and playable content", () => {
    const manifest = readFyp94Manifest();
    expect(Array.isArray(manifest)).toBe(true);

    const playable = filterFyp94PlayableManifest(manifest);
    expect(playable.length).toBeGreaterThan(0);
  });

  it("has health endpoint validation", () => {
    const health = fs.readFileSync("app/api/fyp94/health/route.ts", "utf8");

    expect(health).toContain("getFyp94FeedHealth");
    expect(health).toContain("no-store");
  });
});
