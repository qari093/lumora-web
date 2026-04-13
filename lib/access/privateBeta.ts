export type PrivateBetaAccessInput = {
  enabled?: boolean | null;
  mode?: "allowlist" | "open" | null;
  email?: string | null;
  allowlist?: string[] | null;
};

export type PrivateBetaAccessResult =
  | {
      ok: true;
      access: {
        enabled: boolean;
        mode: "allowlist" | "open";
        allowed: boolean;
        normalizedEmail: string;
      };
    }
  | { ok: false; reason: string };

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function resolvePrivateBetaAccess(
  input: PrivateBetaAccessInput
): PrivateBetaAccessResult {
  const enabled = Boolean(input.enabled);
  const mode = input.mode ?? "allowlist";
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : "";
  const allowlist = Array.isArray(input.allowlist)
    ? input.allowlist.map((x) => normalizeEmail(String(x))).filter(Boolean)
    : [];

  if (!["allowlist", "open"].includes(mode)) {
    return { ok: false, reason: "invalid_mode" };
  }

  if (!enabled) {
    return {
      ok: true,
      access: {
        enabled: false,
        mode,
        allowed: true,
        normalizedEmail: email,
      },
    };
  }

  if (mode === "open") {
    return {
      ok: true,
      access: {
        enabled: true,
        mode,
        allowed: true,
        normalizedEmail: email,
      },
    };
  }

  if (!email) {
    return { ok: false, reason: "missing_email" };
  }

  return {
    ok: true,
    access: {
      enabled: true,
      mode,
      allowed: allowlist.includes(email),
      normalizedEmail: email,
    },
  };
}
