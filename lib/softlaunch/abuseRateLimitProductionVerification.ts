export type AbuseRateLimitSnapshot = {
  route: string;
  rateLimitEnabled: boolean;
  abuseGuardEnabled: boolean;
  requestLimit: number;
  burstLimit: number;
};

export type AbuseRateLimitProductionVerificationInput = {
  snapshots?: AbuseRateLimitSnapshot[] | null;
};

export type AbuseRateLimitProductionVerificationResult =
  | {
      ok: true;
      verification: {
        total: number;
        protected: number;
        ready: boolean;
      };
    }
  | { ok: false; reason: string };

export function evaluateAbuseRateLimitProductionVerification(
  input: AbuseRateLimitProductionVerificationInput
): AbuseRateLimitProductionVerificationResult {
  const snapshots = Array.isArray(input.snapshots) ? input.snapshots : [];
  if (snapshots.length === 0) return { ok: false, reason: "missing_snapshots" };

  let protectedCount = 0;

  for (const item of snapshots) {
    if (!item.route?.trim()) return { ok: false, reason: "missing_route" };
    if (!item.route.startsWith("/api/")) return { ok: false, reason: "invalid_route" };
    if (!Number.isFinite(item.requestLimit) || item.requestLimit <= 0) {
      return { ok: false, reason: "invalid_request_limit" };
    }
    if (!Number.isFinite(item.burstLimit) || item.burstLimit < 0) {
      return { ok: false, reason: "invalid_burst_limit" };
    }
    if (item.burstLimit > item.requestLimit) {
      return { ok: false, reason: "burst_limit_exceeds_request_limit" };
    }

    if (item.rateLimitEnabled && item.abuseGuardEnabled) {
      protectedCount += 1;
    }
  }

  return {
    ok: true,
    verification: {
      total: snapshots.length,
      protected: protectedCount,
      ready: protectedCount === snapshots.length,
    },
  };
}
