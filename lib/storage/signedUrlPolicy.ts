export const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour hard policy

export type SignedUrlPolicyViolation =
  | { code: "ttl_too_long"; ttlSeconds: number; maxSeconds: number }
  | { code: "public_bucket_url"; url: string; reason: string }
  | { code: "missing_exp"; url: string };

const PUBLIC_BUCKET_HINTS = [
  ".r2.dev", // Cloudflare public bucket host
  "s3.amazonaws.com", // common public S3 pattern
  ".s3.", // s3 regional host
];

export function validateSignedUrlPolicy(input: {
  url: string;
  ttlSeconds: number;
  requireExpParam?: boolean; // if true, enforce explicit exp/expires query param
}): { ok: true } | { ok: false; violations: SignedUrlPolicyViolation[] } {
  const { url, ttlSeconds, requireExpParam = true } = input;
  const violations: SignedUrlPolicyViolation[] = [];

  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
    violations.push({ code: "ttl_too_long", ttlSeconds, maxSeconds: SIGNED_URL_TTL_SECONDS });
  } else if (ttlSeconds > SIGNED_URL_TTL_SECONDS) {
    violations.push({ code: "ttl_too_long", ttlSeconds, maxSeconds: SIGNED_URL_TTL_SECONDS });
  }

  const lower = url.toLowerCase();
  for (const hint of PUBLIC_BUCKET_HINTS) {
    if (lower.includes(hint)) {
      violations.push({
        code: "public_bucket_url",
        url,
        reason: `url contains public-host hint "${hint}"`,
      });
      break;
    }
  }

  if (requireExpParam) {
    try {
      const u = new URL(url);
      const hasExp =
        u.searchParams.has("exp") ||
        u.searchParams.has("expires") ||
        u.searchParams.has("X-Amz-Expires") ||
        u.searchParams.has("X-Amz-Date");
      if (!hasExp) violations.push({ code: "missing_exp", url });
    } catch {
      // If URL constructor fails, treat as missing exp for safety.
      violations.push({ code: "missing_exp", url });
    }
  }

  if (violations.length) return { ok: false, violations };
  return { ok: true };
}

export function clampSignedUrlTtlSeconds(ttlSeconds: number): number {
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) return SIGNED_URL_TTL_SECONDS;
  return Math.min(Math.floor(ttlSeconds), SIGNED_URL_TTL_SECONDS);
}
