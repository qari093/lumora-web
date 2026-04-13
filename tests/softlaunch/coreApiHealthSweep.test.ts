import { describe, expect, it } from "vitest";
import { evaluateCoreApiHealthSweep } from "@/lib/softlaunch/coreApiHealthSweep";

describe("soft-launch core API health sweep", () => {
  it("passes when all endpoints are healthy", () => {
    const out = evaluateCoreApiHealthSweep({
      endpoints: [
        { path: "/api/health", status: 200, ok: true },
        { path: "/api/healthz", status: 200, ok: true },
        { path: "/api/fyp", status: 200, ok: true },
        { path: "/api/version", status: 200, ok: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.checked).toBe(4);
      expect(out.sweep.healthy).toBe(4);
      expect(out.sweep.ready).toBe(true);
    }
  });

  it("fails readiness when one endpoint is unhealthy", () => {
    const out = evaluateCoreApiHealthSweep({
      endpoints: [
        { path: "/api/health", status: 200, ok: true },
        { path: "/api/fyp", status: 500, ok: false },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.ready).toBe(false);
      expect(out.sweep.healthy).toBe(1);
    }
  });

  it("rejects invalid path", () => {
    const out = evaluateCoreApiHealthSweep({
      endpoints: [{ path: "/fyp", status: 200, ok: true }],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_path" });
  });

  it("rejects invalid status", () => {
    const out = evaluateCoreApiHealthSweep({
      endpoints: [{ path: "/api/health", status: 0, ok: true }],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_status" });
  });
});
