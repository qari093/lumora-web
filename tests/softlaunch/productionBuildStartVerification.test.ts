import { describe, expect, it } from "vitest";
import { evaluateProductionBuildStartVerification } from "@/lib/softlaunch/productionBuildStartVerification";

describe("soft-launch production build + start verification", () => {
  it("passes when build, start, and health are all green", () => {
    const out = evaluateProductionBuildStartVerification({
      buildSucceeded: true,
      serverStarted: true,
      healthEndpointOk: true,
      port: 3010,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.ready).toBe(true);
      expect(out.verification.port).toBe(3010);
    }
  });

  it("stays not-ready if server did not start", () => {
    const out = evaluateProductionBuildStartVerification({
      buildSucceeded: true,
      serverStarted: false,
      healthEndpointOk: true,
      port: 3010,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.ready).toBe(false);
    }
  });

  it("rejects invalid port 0", () => {
    const out = evaluateProductionBuildStartVerification({
      buildSucceeded: true,
      serverStarted: true,
      healthEndpointOk: true,
      port: 0,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_port" });
  });

  it("rejects invalid port > 65535", () => {
    const out = evaluateProductionBuildStartVerification({
      buildSucceeded: true,
      serverStarted: true,
      healthEndpointOk: true,
      port: 70000,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_port" });
  });
});
