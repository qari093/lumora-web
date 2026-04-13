export type PrivateBetaGateActivationInput = {
  enabled?: boolean | null;
  mode?: "allowlist" | "invite_only" | "open" | null;
  allowlistCount?: number | null;
};

export type PrivateBetaGateActivationResult =
  | {
      ok: true;
      gate: {
        enabled: boolean;
        mode: "allowlist" | "invite_only" | "open";
        allowlistCount: number;
        active: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluatePrivateBetaGateActivation(
  input: PrivateBetaGateActivationInput
): PrivateBetaGateActivationResult {
  const enabled = Boolean(input.enabled);
  const mode = input.mode ?? "allowlist";
  const allowlistCount =
    typeof input.allowlistCount === "number" && Number.isFinite(input.allowlistCount)
      ? Math.trunc(input.allowlistCount)
      : NaN;

  if (!["allowlist", "invite_only", "open"].includes(mode)) {
    return { ok: false, reason: "invalid_mode" };
  }

  if (!Number.isFinite(allowlistCount) || allowlistCount < 0) {
    return { ok: false, reason: "invalid_allowlist_count" };
  }

  if ((mode === "allowlist" || mode === "invite_only") && enabled && allowlistCount < 1) {
    return { ok: false, reason: "allowlist_required" };
  }

  return {
    ok: true,
    gate: {
      enabled,
      mode,
      allowlistCount,
      active: enabled,
    },
  };
}
