import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateFallbackBoundaryVerification } from "@/lib/softlaunch/fallbackBoundaryVerification";

describe("soft-launch fallback / boundary verification", () => {
  it("passes valid fallback cases", () => {
    const cases = JSON.parse(fs.readFileSync("data/softlaunch/fallback-boundary.json", "utf8"));
    const out = evaluateFallbackBoundaryVerification({ cases });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.safe).toBe(3);
      expect(out.verification.recoverable).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects duplicate id", () => {
    const out = evaluateFallbackBoundaryVerification({
      cases: [
        { id: "x", route: "/fyp", fallbackShown: true, recoveryAvailable: true, safeMessage: "Retry" },
        { id: "x", route: "/live", fallbackShown: true, recoveryAvailable: true, safeMessage: "Retry" }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_id" });
  });

  it("rejects invalid route", () => {
    const out = evaluateFallbackBoundaryVerification({
      cases: [
        { id: "x", route: "fyp", fallbackShown: true, recoveryAvailable: true, safeMessage: "Retry" }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_route" });
  });

  it("rejects missing fallback", () => {
    const out = evaluateFallbackBoundaryVerification({
      cases: [
        { id: "x", route: "/fyp", fallbackShown: false, recoveryAvailable: true, safeMessage: "Retry" }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "fallback_not_shown" });
  });
});
