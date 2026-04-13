import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateApiRouteIntegrityVerification } from "@/lib/softlaunch/apiRouteIntegrityVerification";

describe("soft-launch API route integrity verification", () => {
  it("passes valid route set", () => {
    const routes = JSON.parse(fs.readFileSync("data/softlaunch/api-route-integrity.json", "utf8"));
    const out = evaluateApiRouteIntegrityVerification({ routes });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.existing).toBe(4);
      expect(out.verification.healthy).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects invalid path", () => {
    const out = evaluateApiRouteIntegrityVerification({
      routes: [{ path: "/fyp", method: "GET", exists: true, healthy: true }]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_path" });
  });

  it("rejects invalid method", () => {
    const out = evaluateApiRouteIntegrityVerification({
      routes: [{ path: "/api/fyp", method: "HEAD" as any, exists: true, healthy: true }]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_method" });
  });

  it("fails readiness if unhealthy route exists", () => {
    const out = evaluateApiRouteIntegrityVerification({
      routes: [{ path: "/api/fyp", method: "GET", exists: true, healthy: false }]
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.ready).toBe(false);
    }
  });
});
