export type InviteRecord = {
  email: string;
  code: string;
  status: "pending" | "accepted";
};

export type AllowlistInviteContractInput = {
  mode?: "allowlist" | "invite_only" | null;
  invites?: InviteRecord[] | null;
};

export type AllowlistInviteContractResult =
  | {
      ok: true;
      contract: {
        mode: "allowlist" | "invite_only";
        totalInvites: number;
        pendingInvites: number;
        acceptedInvites: number;
        valid: boolean;
      };
    }
  | { ok: false; reason: string };

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function evaluateAllowlistInviteContract(
  input: AllowlistInviteContractInput
): AllowlistInviteContractResult {
  const mode = input.mode ?? "allowlist";
  const invites = Array.isArray(input.invites) ? input.invites : [];

  if (!["allowlist", "invite_only"].includes(mode)) {
    return { ok: false, reason: "invalid_mode" };
  }
  if (invites.length === 0) {
    return { ok: false, reason: "missing_invites" };
  }

  const seenEmails = new Set<string>();
  const seenCodes = new Set<string>();
  let pendingInvites = 0;
  let acceptedInvites = 0;

  for (const invite of invites) {
    const email = normalizeEmail(String(invite.email || ""));
    const code = String(invite.code || "").trim();
    const status = invite.status;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, reason: "invalid_email" };
    }
    if (!code || code.length < 6) {
      return { ok: false, reason: "invalid_code" };
    }
    if (!["pending", "accepted"].includes(status)) {
      return { ok: false, reason: "invalid_status" };
    }
    if (seenEmails.has(email)) {
      return { ok: false, reason: "duplicate_email" };
    }
    if (seenCodes.has(code)) {
      return { ok: false, reason: "duplicate_code" };
    }

    seenEmails.add(email);
    seenCodes.add(code);

    if (status === "pending") pendingInvites += 1;
    if (status === "accepted") acceptedInvites += 1;
  }

  return {
    ok: true,
    contract: {
      mode,
      totalInvites: invites.length,
      pendingInvites,
      acceptedInvites,
      valid: true,
    },
  };
}
