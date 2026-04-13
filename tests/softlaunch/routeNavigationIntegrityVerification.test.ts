import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateRouteNavigationIntegrityVerification } from "@/lib/softlaunch/routeNavigationIntegrityVerification";

describe("soft-launch route + navigation integrity verification", () => {
  it("passes valid navigation routes", () => {
    const routes = JSON.parse(fs.readFileSync("data/softlaunch/route-navigation-integrity.json", "utf8"));
    const out = evaluateRouteNavigationIntegrityVerification({ routes });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.enabled).toBe(4);
      expect(out.verification.valid).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects missing from", () => {
    const out = evaluateRouteNavigationIntegrityVerification({
      routes: [{ from: "", to: "/fyp", enabled: true, valid: true }]
    });

    expect(out).toEqual({ ok: false, reason: "missing_from" });
  });

  it("rejects invalid from", () => {
    const out = evaluateRouteNavigationIntegrityVerification({
      routes: [{ from: "home", to: "/fyp", enabled: true, valid: true }]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_from" });
  });

  it("fails readiness when route is not valid", () => {
    const out = evaluateRouteNavigationIntegrityVerification({
      routes: [{ from: "/", to: "/fyp", enabled: true, valid: false }]
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.ready).toBe(false);
    }
  });
});
