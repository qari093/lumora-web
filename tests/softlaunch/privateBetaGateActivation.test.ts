import { describe, expect, it } from "vitest";
import { evaluatePrivateBetaGateActivation } from "@/lib/softlaunch/privateBetaGateActivation";

describe("soft-launch private beta access gate activation", () => {
  it("passes allowlist mode when enabled and populated", () => {
    const out = evaluatePrivateBetaGateActivation({
      enabled: true,
      mode: "allowlist",
      allowlistCount: 25,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.gate.active).toBe(true);
      expect(out.gate.mode).toBe("allowlist");
    }
  });

  it("passes open mode with zero allowlist", () => {
    const out = evaluatePrivateBetaGateActivation({
      enabled: true,
      mode: "open",
      allowlistCount: 0,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.gate.mode).toBe("open");
    }
  });

  it("rejects enabled allowlist mode without members", () => {
    const out = evaluatePrivateBetaGateActivation({
      enabled: true,
      mode: "allowlist",
      allowlistCount: 0,
    });

    expect(out).toEqual({ ok: false, reason: "allowlist_required" });
  });

  it("rejects invalid mode", () => {
    const out = evaluatePrivateBetaGateActivation({
      enabled: true,
      mode: "beta" as any,
      allowlistCount: 1,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_mode" });
  });
});
