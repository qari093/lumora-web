export type SessionLike = {
  userId?: string | null;
  token?: string | null;
  fingerprint?: string | null;
  issuedAt?: number | null;
  expiresAt?: number | null;
};

export type EdgeCaseResult =
  | { ok: true; normalized: Required<Pick<SessionLike, "userId" | "token" | "fingerprint" | "issuedAt" | "expiresAt">> }
  | { ok: false; reason: string };

type ValidateOptions = {
  now?: number;
  maxSessionMs?: number;
  requireFingerprint?: boolean;
};

const DEFAULT_MAX_SESSION_MS = 1000 * 60 * 60 * 24 * 30;

export function validateAuthEdgeCases(
  session: SessionLike | null | undefined,
  opts: ValidateOptions = {}
): EdgeCaseResult {
  const now = opts.now ?? Date.now();
  const maxSessionMs = opts.maxSessionMs ?? DEFAULT_MAX_SESSION_MS;
  const requireFingerprint = opts.requireFingerprint ?? true;

  if (!session) return { ok: false, reason: "missing_session" };

  const userId = typeof session.userId === "string" ? session.userId.trim() : "";
  const token = typeof session.token === "string" ? session.token.trim() : "";
  const fingerprint = typeof session.fingerprint === "string" ? session.fingerprint.trim() : "";
  const issuedAt = typeof session.issuedAt === "number" ? session.issuedAt : NaN;
  const expiresAt = typeof session.expiresAt === "number" ? session.expiresAt : NaN;

  if (!userId) return { ok: false, reason: "missing_user_id" };
  if (!token) return { ok: false, reason: "missing_token" };
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt)) return { ok: false, reason: "invalid_timestamps" };
  if (issuedAt <= 0 || expiresAt <= 0) return { ok: false, reason: "non_positive_timestamps" };
  if (expiresAt <= issuedAt) return { ok: false, reason: "expiry_not_after_issue" };
  if (issuedAt > now + 60_000) return { ok: false, reason: "issued_in_future" };
  if (expiresAt <= now) return { ok: false, reason: "expired" };
  if (expiresAt - issuedAt > maxSessionMs) return { ok: false, reason: "session_window_too_large" };
  if (requireFingerprint && !fingerprint) return { ok: false, reason: "missing_fingerprint" };

  return {
    ok: true,
    normalized: {
      userId,
      token,
      fingerprint,
      issuedAt,
      expiresAt,
    },
  };
}
