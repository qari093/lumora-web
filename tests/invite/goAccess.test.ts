import { describe, expect, it } from "vitest";
import { resolveInviteAccess } from "@/src/lib/invite/goAccess";

describe("Lumora invite gate", () => {
  it("allows access in allowlist private beta mode", () => {
    const out = resolveInviteAccess({
      privateBetaEnabled: true,
      waitlistEnabled: true,
      testerAccessMode: "allowlist",
      registrationOpen: false,
      gated: true,
      valid: true,
    });
    expect(out.allowAccess).toBe(true);
  });

  it("shows waitlist when blocked", () => {
    const out = resolveInviteAccess({
      privateBetaEnabled: false,
      waitlistEnabled: true,
      testerAccessMode: "allowlist",
      registrationOpen: false,
      gated: false,
      valid: true,
    });
    expect(out.allowAccess).toBe(false);
    expect(out.showWaitlist).toBe(true);
  });
});
