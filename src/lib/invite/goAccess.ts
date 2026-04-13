export type InviteGateConfig = {
  privateBetaEnabled: boolean;
  waitlistEnabled: boolean;
  testerAccessMode: "allowlist" | "open";
  registrationOpen: boolean;
  gated: boolean;
  valid: boolean;
};

export function resolveInviteAccess(config: InviteGateConfig) {
  const allowAccess =
    config.valid &&
    (
      config.testerAccessMode === "open" ||
      (config.privateBetaEnabled && config.gated)
    );

  return {
    allowAccess,
    showWaitlist: !allowAccess && config.waitlistEnabled,
    mode: config.testerAccessMode,
  };
}
