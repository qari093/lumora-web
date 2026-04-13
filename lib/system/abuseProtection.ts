export type AbuseSignalInput = {
  ipHash?: string | null;
  userAgent?: string | null;
  requestCount?: number | null;
  failedAuthCount?: number | null;
  velocityScore?: number | null;
};

export type AbuseSignalResult =
  | {
      ok: true;
      assessment: {
        riskScore: number;
        blocked: boolean;
        flags: string[];
      };
    }
  | { ok: false; reason: string };

export function assessAbuseRisk(input: AbuseSignalInput): AbuseSignalResult {
  const ipHash = typeof input.ipHash === "string" ? input.ipHash.trim() : "";
  const userAgent = typeof input.userAgent === "string" ? input.userAgent.trim() : "";
  const requestCount =
    typeof input.requestCount === "number" && Number.isFinite(input.requestCount)
      ? Math.max(0, Math.trunc(input.requestCount))
      : NaN;
  const failedAuthCount =
    typeof input.failedAuthCount === "number" && Number.isFinite(input.failedAuthCount)
      ? Math.max(0, Math.trunc(input.failedAuthCount))
      : NaN;
  const velocityScore =
    typeof input.velocityScore === "number" && Number.isFinite(input.velocityScore)
      ? Math.max(0, input.velocityScore)
      : NaN;

  if (!ipHash) return { ok: false, reason: "missing_ip_hash" };
  if (!userAgent) return { ok: false, reason: "missing_user_agent" };
  if (!Number.isFinite(requestCount)) return { ok: false, reason: "invalid_request_count" };
  if (!Number.isFinite(failedAuthCount)) return { ok: false, reason: "invalid_failed_auth_count" };
  if (!Number.isFinite(velocityScore)) return { ok: false, reason: "invalid_velocity_score" };

  const flags: string[] = [];
  let riskScore = 0;

  if (/bot|crawler|spider|curl|wget/i.test(userAgent)) {
    flags.push("suspicious_user_agent");
    riskScore += 40;
  }

  if (requestCount > 100) {
    flags.push("high_request_volume");
    riskScore += 25;
  }

  if (failedAuthCount > 10) {
    flags.push("high_failed_auth");
    riskScore += 25;
  }

  if (velocityScore > 0.8) {
    flags.push("high_velocity");
    riskScore += 20;
  }

  if (ipHash.length < 6) {
    flags.push("weak_ip_hash");
    riskScore += 10;
  }

  riskScore = Math.min(100, riskScore);

  return {
    ok: true,
    assessment: {
      riskScore,
      blocked: riskScore >= 60,
      flags,
    },
  };
}
