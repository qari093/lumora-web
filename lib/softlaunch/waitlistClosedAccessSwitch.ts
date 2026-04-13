export type WaitlistClosedAccessSwitchInput = {
  privateBetaEnabled?: boolean | null;
  waitlistEnabled?: boolean | null;
  testerAccessMode?: "allowlist" | "invite_only" | "closed" | "open" | null;
  registrationOpen?: boolean | null;
};

export type WaitlistClosedAccessSwitchResult =
  | {
      ok: true;
      state: {
        privateBetaEnabled: boolean;
        waitlistEnabled: boolean;
        testerAccessMode: "allowlist" | "invite_only" | "closed" | "open";
        registrationOpen: boolean;
        gated: boolean;
        valid: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateWaitlistClosedAccessSwitch(
  input: WaitlistClosedAccessSwitchInput
): WaitlistClosedAccessSwitchResult {
  const privateBetaEnabled = Boolean(input.privateBetaEnabled);
  const waitlistEnabled = Boolean(input.waitlistEnabled);
  const registrationOpen = Boolean(input.registrationOpen);
  const testerAccessMode = input.testerAccessMode ?? "closed";

  if (!["allowlist", "invite_only", "closed", "open"].includes(testerAccessMode)) {
    return { ok: false, reason: "invalid_tester_access_mode" };
  }

  if (!privateBetaEnabled && waitlistEnabled) {
    return { ok: false, reason: "waitlist_requires_private_beta" };
  }

  if (testerAccessMode === "closed" && registrationOpen) {
    return { ok: false, reason: "closed_mode_disallows_open_registration" };
  }

  const gated = privateBetaEnabled && testerAccessMode !== "open";

  return {
    ok: true,
    state: {
      privateBetaEnabled,
      waitlistEnabled,
      testerAccessMode,
      registrationOpen,
      gated,
      valid: true,
    },
  };
}
