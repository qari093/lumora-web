import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateEdgeCacheVerification } from "@/lib/softlaunch/edgeCacheVerification";

describe("soft-launch edge cache verification", () => {
  it("passes valid cache configuration", () => {
    const routes = JSON.parse(fs.readFileSync("data/softlaunch/edge-cache.json", "utf8"));
    const out = evaluateEdgeCacheVerification({ routes });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.valid).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects invalid cache mode", () => {
    const out = evaluateEdgeCacheVerification({
      routes: [
        { path: "/fyp", cacheMode: "bad", personalized: true, valid: true }
      ] as any
    });

    expect(out).toEqual({ ok: false, reason: "invalid_cache_mode" });
  });

  it("rejects personalized edge cache", () => {
    const out = evaluateEdgeCacheVerification({
      routes: [
        { path: "/fyp", cacheMode: "edge", personalized: true, valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "personalized_route_cannot_use_edge_cache" });
  });

  it("rejects invalid path", () => {
    const out = evaluateEdgeCacheVerification({
      routes: [
        { path: "fyp", cacheMode: "private", personalized: true, valid: true }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_path" });
  });
});
