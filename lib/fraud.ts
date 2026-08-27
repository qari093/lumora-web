type FraudGuardOptions = {
  scope?: string;
  userId?: string | null;
  viewKey?: string | null;
  limits?: {
    perIp?: {
      limit?: number;
      windowSec?: number;
    };
  };
};

type FraudGuardResult =
  | {
      blocked: false;
      risk: "low";
    }
  | {
      blocked: true;
      status: number;
      body: {
        ok: false;
        error: string;
        reason: string;
      };
    };

type Bucket = {
  count: number;
  resetAt: number;
};

const globalFraudState = globalThis as typeof globalThis & {
  __lumoraFraudBuckets?: Map<string, Bucket>;
};

const buckets =
  globalFraudState.__lumoraFraudBuckets ??
  (globalFraudState.__lumoraFraudBuckets = new Map<string, Bucket>());

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp ? realIp.slice(0, 128) : "unknown";
}

function blocked(reason: string, status = 429): FraudGuardResult {
  return {
    blocked: true,
    status,
    body: {
      ok: false,
      error: "FRAUD_GUARD_BLOCKED",
      reason,
    },
  };
}

export async function recordFraudEvent(..._args: unknown[]) {
  return;
}

export async function fraudGuard(
  req: Request,
  options: FraudGuardOptions = {},
): Promise<FraudGuardResult> {
  const scope =
    typeof options.scope === "string" && options.scope.trim()
      ? options.scope.trim().slice(0, 64)
      : "default";

  const userId =
    typeof options.userId === "string"
      ? options.userId.trim()
      : "";

  const viewKey =
    typeof options.viewKey === "string"
      ? options.viewKey.trim()
      : "";

  if (userId.length > 191) {
    return blocked("invalid_user_identifier", 400);
  }

  if (viewKey.length > 255) {
    return blocked("invalid_view_identifier", 400);
  }

  const configuredLimit = Number(options.limits?.perIp?.limit);
  const configuredWindow = Number(options.limits?.perIp?.windowSec);

  const limit =
    Number.isFinite(configuredLimit) && configuredLimit > 0
      ? Math.min(1000, Math.floor(configuredLimit))
      : 30;

  const windowSec =
    Number.isFinite(configuredWindow) && configuredWindow > 0
      ? Math.min(3600, Math.floor(configuredWindow))
      : 10;

  const ip = clientIp(req);
  const now = Date.now();
  const key = `${scope}:${ip}`;

  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = {
      count: 0,
      resetAt: now + windowSec * 1000,
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > limit) {
    return blocked("rate_limit_exceeded", 429);
  }

  if (buckets.size > 5000) {
    for (const [bucketKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return {
    blocked: false,
    risk: "low",
  };
}
