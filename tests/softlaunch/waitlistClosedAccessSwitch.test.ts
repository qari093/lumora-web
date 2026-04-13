import { describe, expect, it } from "vitest";
import { evaluateWaitlistClosedAccessSwitch } from "@/lib/softlaunch/waitlistClosedAccessSwitch";

describe("soft-launch waitlist / closed-access switch activation", () => {
  it("passes allowlist + waitlist gated mode", () => {
    const out = evaluateWaitlistClosedAccessSwitch({
      privateBetaEnabled: true,
      waitlistEnabled: true,
      testerAccessMode: "allowlist",
      registrationOpen: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.gated).toBe(true);
      expect(out.state.valid).toBe(true);
    }
  });

  it("passes fully closed mode", () => {
    const out = evaluateWaitlistClosedAccessSwitch({
      privateBetaEnabled: true,
      waitlistEnabled: false,
      testerAccessMode: "closed",
      registrationOpen: false,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.gated).toBe(true);
      expect(out.state.testerAccessMode).toBe("closed");
    }
  });

  it("rejects waitlist without private beta", () => {
    const out = evaluateWaitlistClosedAccessSwitch({
      privateBetaEnabled: false,
      waitlistEnabled: true,
      testerAccessMode: "closed",
      registrationOpen: false,
    });

    expect(out).toEqual({ ok: false, reason: "waitlist_requires_private_beta" });
  });

  it("rejects closed mode with open registration", () => {
    const out = evaluateWaitlistClosedAccessSwitch({
      privateBetaEnabled: true,
      waitlistEnabled: false,
      testerAccessMode: "closed",
      registrationOpen: true,
    });

    expect(out).toEqual({ ok: false, reason: "closed_mode_disallows_open_registration" });
  });
});
