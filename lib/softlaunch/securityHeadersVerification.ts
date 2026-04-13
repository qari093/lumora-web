export type HeaderSnapshot = {
  path: string;
  csp: string;
  frameOptions: "DENY" | "SAMEORIGIN";
  contentTypeOptions: "nosniff";
  referrerPolicy: string;
  valid: boolean;
};

export type SecurityHeadersVerificationInput = {
  snapshots?: HeaderSnapshot[] | null;
};

export type SecurityHeadersVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        valid: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateSecurityHeadersVerification(
  input: SecurityHeadersVerificationInput
): SecurityHeadersVerificationResult {
  const snapshots = Array.isArray(input.snapshots) ? input.snapshots : [];
  if (snapshots.length === 0) return { ok: false, reason: "missing_snapshots" };

  let validCount = 0;

  for (const snap of snapshots) {
    if (!snap.path?.trim()) return { ok: false, reason: "missing_path" };
    if (!snap.path.startsWith("/")) return { ok: false, reason: "invalid_path" };
    if (!snap.csp?.trim()) return { ok: false, reason: "missing_csp" };
    if (!["DENY", "SAMEORIGIN"].includes(snap.frameOptions)) {
      return { ok: false, reason: "invalid_frame_options" };
    }
    if (snap.contentTypeOptions !== "nosniff") {
      return { ok: false, reason: "invalid_content_type_options" };
    }
    if (!snap.referrerPolicy?.trim()) {
      return { ok: false, reason: "missing_referrer_policy" };
    }

    if (snap.valid) validCount += 1;
  }

  return {
    ok: true,
    verification: {
      total: snapshots.length,
      valid: validCount,
      ready: validCount === snapshots.length,
    },
  };
}
