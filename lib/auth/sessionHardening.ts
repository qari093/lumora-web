export type SessionInput = {
  userId: string;
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
  ipHash?: string | null;
  userAgentHash?: string | null;
};

export type SessionValidationResult = {
  ok: boolean;
  reason:
    | "valid"
    | "invalid_user"
    | "invalid_session"
    | "invalid_timestamps"
    | "expired"
    | "fingerprint_mismatch";
};

function nonEmpty(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateSession(
  input: SessionInput,
  fingerprint?: {
    ipHash?: string | null;
    userAgentHash?: string | null;
    enforceFingerprint?: boolean;
  }
): SessionValidationResult {
  if (!nonEmpty(input.userId)) {
    return { ok: false, reason: "invalid_user" };
  }

  if (!nonEmpty(input.sessionId) || input.sessionId.trim().length < 8) {
    return { ok: false, reason: "invalid_session" };
  }

  if (
    !Number.isFinite(input.issuedAt) ||
    !Number.isFinite(input.expiresAt) ||
    input.issuedAt <= 0 ||
    input.expiresAt <= input.issuedAt
  ) {
    return { ok: false, reason: "invalid_timestamps" };
  }

  if (Date.now() > input.expiresAt) {
    return { ok: false, reason: "expired" };
  }

  const enforceFingerprint = Boolean(fingerprint?.enforceFingerprint);
  if (enforceFingerprint) {
    const ipMismatch =
      nonEmpty(input.ipHash ?? undefined) &&
      nonEmpty(fingerprint?.ipHash ?? undefined) &&
      input.ipHash !== fingerprint?.ipHash;

    const uaMismatch =
      nonEmpty(input.userAgentHash ?? undefined) &&
      nonEmpty(fingerprint?.userAgentHash ?? undefined) &&
      input.userAgentHash !== fingerprint?.userAgentHash;

    if (ipMismatch || uaMismatch) {
      return { ok: false, reason: "fingerprint_mismatch" };
    }
  }

  return { ok: true, reason: "valid" };
}
