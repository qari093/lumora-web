import crypto from "node:crypto";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_LIMIT = 60;
const DEFAULT_MAX_BODY_BYTES = 32_768;
const MAX_COST = 50;

export type ObservabilityRateLimitOptions = {
  scope: string;
  limit?: number;
  windowMs?: number;
  maxBodyBytes?: number;
  cost?: number;
  now?: Date;
};

export type ObservabilityRateLimitResult = {
  allowed: boolean;
  status: 200 | 413 | 429;
  reason: "allowed" | "payload_too_large" | "rate_limited";
  limit: number;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds: number;
  key: string;
  clientId: string;
};

type BucketRow = {
  key: string;
  count: number;
  expiresAt: Date;
};

function boundedInteger(
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.min(
    maximum,
    Math.max(minimum, Math.trunc(value)),
  );
}

function normalizeScope(scope: string): string {
  const normalized = scope.trim().toLowerCase();

  if (!normalized) {
    throw new Error(
      "observability_rate_limit_scope_required",
    );
  }

  return normalized.slice(0, 120);
}

function firstForwardedAddress(
  request: Request,
): string {
  const forwarded =
    request.headers.get("x-forwarded-for") || "";

  return forwarded
    .split(",")[0]
    ?.trim()
    .slice(0, 128) || "unknown";
}

export function deriveObservabilityClientId(
  request: Request,
): string {
  const material = [
    firstForwardedAddress(request),
    request.headers.get("x-real-ip") || "",
    request.headers.get("user-agent") || "",
    request.headers.get("accept-language") || "",
  ].join("|");

  return crypto
    .createHash("sha256")
    .update(material)
    .digest("hex")
    .slice(0, 32);
}

export function requestContentLength(
  request: Request,
): number | null {
  const raw =
    request.headers.get("content-length")?.trim();

  if (!raw) {
    return null;
  }

  const value = Number(raw);

  if (
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function buildBucketKey(
  scope: string,
  clientId: string,
  windowStart: Date,
): string {
  return crypto
    .createHash("sha256")
    .update(
      [
        scope,
        clientId,
        windowStart.toISOString(),
      ].join("|"),
    )
    .digest("hex");
}

export function observabilityRateLimitHeaders(
  result: ObservabilityRateLimitResult,
): Record<string, string> {
  return {
    "cache-control": "no-store, max-age=0",
    "x-ratelimit-limit": String(result.limit),
    "x-ratelimit-remaining": String(
      result.remaining,
    ),
    "x-ratelimit-reset": String(
      Math.ceil(result.resetAt.getTime() / 1000),
    ),
    ...(result.allowed
      ? {}
      : {
          "retry-after": String(
            result.retryAfterSeconds,
          ),
        }),
  };
}

export async function enforceObservabilityRateLimit(
  request: Request,
  options: ObservabilityRateLimitOptions,
): Promise<ObservabilityRateLimitResult> {
  const scope = normalizeScope(options.scope);
  const limit = boundedInteger(
    options.limit,
    DEFAULT_LIMIT,
    1,
    100_000,
  );
  const windowMs = boundedInteger(
    options.windowMs,
    DEFAULT_WINDOW_MS,
    1_000,
    86_400_000,
  );
  const maximumBodyBytes = boundedInteger(
    options.maxBodyBytes,
    DEFAULT_MAX_BODY_BYTES,
    1_024,
    1_048_576,
  );
  const cost = boundedInteger(
    options.cost,
    1,
    1,
    MAX_COST,
  );
  const now =
    options.now instanceof Date
      ? options.now
      : new Date();

  const clientId =
    deriveObservabilityClientId(request);

  const windowStart = new Date(
    Math.floor(now.getTime() / windowMs) *
      windowMs,
  );
  const resetAt = new Date(
    windowStart.getTime() + windowMs,
  );
  const key = buildBucketKey(
    scope,
    clientId,
    windowStart,
  );

  const contentLength =
    requestContentLength(request);

  if (
    contentLength !== null &&
    contentLength > maximumBodyBytes
  ) {
    return {
      allowed: false,
      status: 413,
      reason: "payload_too_large",
      limit,
      remaining: 0,
      resetAt,
      retryAfterSeconds: 0,
      key,
      clientId,
    };
  }

  const expiresAt = new Date(
    resetAt.getTime() + windowMs,
  );

  const rows = await prisma.$queryRaw<
    BucketRow[]
  >(Prisma.sql`
    INSERT INTO "ObservabilityRateLimitBucket"
      (
        "key",
        "scope",
        "windowStart",
        "count",
        "expiresAt",
        "createdAt",
        "updatedAt"
      )
    VALUES
      (
        ${key},
        ${scope},
        ${windowStart},
        ${cost},
        ${expiresAt},
        ${now},
        ${now}
      )
    ON CONFLICT ("key")
    DO UPDATE SET
      "count" =
        "ObservabilityRateLimitBucket"."count" +
        EXCLUDED."count",
      "expiresAt" = EXCLUDED."expiresAt",
      "updatedAt" = EXCLUDED."updatedAt"
    RETURNING
      "key",
      "count",
      "expiresAt"
  `);

  const bucket = rows[0];

  if (!bucket) {
    throw new Error(
      "observability_rate_limit_bucket_missing",
    );
  }

  const remaining = Math.max(
    0,
    limit - bucket.count,
  );
  const allowed = bucket.count <= limit;
  const retryAfterSeconds = allowed
    ? 0
    : Math.max(
        1,
        Math.ceil(
          (resetAt.getTime() - now.getTime()) /
            1000,
        ),
      );

  return {
    allowed,
    status: allowed ? 200 : 429,
    reason: allowed
      ? "allowed"
      : "rate_limited",
    limit,
    remaining,
    resetAt,
    retryAfterSeconds,
    key,
    clientId,
  };
}
