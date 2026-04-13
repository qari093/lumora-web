import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateAbuseRateLimitProductionVerification } from "@/lib/softlaunch/abuseRateLimitProductionVerification";

describe("soft-launch abuse / rate-limit production verification", () => {
  it("passes valid protected routes", () => {
    const snapshots = JSON.parse(fs.readFileSync("data/softlaunch/abuse-rate-limit.json", "utf8"));
    const out = evaluateAbuseRateLimitProductionVerification({ snapshots });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(4);
      expect(out.verification.protected).toBe(4);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects invalid route", () => {
    const out = evaluateAbuseRateLimitProductionVerification({
      snapshots: [
        { route: "/fyp", rateLimitEnabled: true, abuseGuardEnabled: true, requestLimit: 10, burstLimit: 1 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_route" });
  });

  it("rejects invalid request limit", () => {
    const out = evaluateAbuseRateLimitProductionVerification({
      snapshots: [
        { route: "/api/fyp", rateLimitEnabled: true, abuseGuardEnabled: true, requestLimit: 0, burstLimit: 0 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_request_limit" });
  });

  it("rejects burst over request limit", () => {
    const out = evaluateAbuseRateLimitProductionVerification({
      snapshots: [
        { route: "/api/fyp", rateLimitEnabled: true, abuseGuardEnabled: true, requestLimit: 10, burstLimit: 20 }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "burst_limit_exceeds_request_limit" });
  });
});
