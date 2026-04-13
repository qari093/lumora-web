import { describe, expect, it } from "vitest";
import { evaluateAuthSessionProductionSweep } from "@/lib/softlaunch/authSessionProductionSweep";

describe("soft-launch auth/session production sweep", () => {
  it("passes when all auth/session probes pass", () => {
    const out = evaluateAuthSessionProductionSweep({
      probes: [
        { name: "valid_session", passed: true },
        { name: "expired_session", passed: true },
        { name: "missing_token", passed: true },
        { name: "fingerprint_match", passed: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.checked).toBe(4);
      expect(out.sweep.passed).toBe(4);
      expect(out.sweep.ready).toBe(true);
    }
  });

  it("fails readiness when one probe fails", () => {
    const out = evaluateAuthSessionProductionSweep({
      probes: [
        { name: "valid_session", passed: true },
        { name: "expired_session", passed: true },
        { name: "missing_token", passed: false },
        { name: "fingerprint_match", passed: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.ready).toBe(false);
      expect(out.sweep.passed).toBe(3);
    }
  });

  it("rejects duplicate probe", () => {
    const out = evaluateAuthSessionProductionSweep({
      probes: [
        { name: "valid_session", passed: true },
        { name: "valid_session", passed: true },
        { name: "missing_token", passed: true },
        { name: "fingerprint_match", passed: true },
      ] as any,
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_probe" });
  });

  it("rejects incomplete probe set", () => {
    const out = evaluateAuthSessionProductionSweep({
      probes: [
        { name: "valid_session", passed: true },
        { name: "expired_session", passed: true },
      ] as any,
    });

    expect(out).toEqual({ ok: false, reason: "incomplete_probe_set" });
  });
});
