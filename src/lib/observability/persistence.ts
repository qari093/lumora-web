import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const MAX_METADATA_BYTES = 16_384;
const MAX_METADATA_DEPTH = 4;
const MAX_ARRAY_ITEMS = 50;
const MAX_OBJECT_KEYS = 50;

function clampString(
  value: unknown,
  maximumLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maximumLength);
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

function finiteInteger(value: unknown): number | null {
  const number = finiteNumber(value);

  return number === null
    ? null
    : Math.trunc(number);
}

function sanitizeJsonValue(
  value: unknown,
  depth = 0,
): Prisma.InputJsonValue | undefined {
  if (depth > MAX_METADATA_DEPTH) {
    return undefined;
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : undefined;
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ARRAY_ITEMS)
      .map(item => sanitizeJsonValue(item, depth + 1))
      .filter(
        (item): item is Prisma.InputJsonValue =>
          item !== undefined,
      );
  }

  if (
    value !== null &&
    typeof value === "object"
  ) {
    const output: Record<string, Prisma.InputJsonValue> = {};

    for (
      const [rawKey, rawValue] of Object.entries(value)
        .slice(0, MAX_OBJECT_KEYS)
    ) {
      const key = rawKey.trim().slice(0, 100);

      if (!key) {
        continue;
      }

      const sanitized = sanitizeJsonValue(
        rawValue,
        depth + 1,
      );

      if (sanitized !== undefined) {
        output[key] = sanitized;
      }
    }

    return output;
  }

  return undefined;
}

export function sanitizeObservabilityMetadata(
  value: unknown,
): Prisma.InputJsonValue | undefined {
  const sanitized = sanitizeJsonValue(value);

  if (sanitized === undefined) {
    return undefined;
  }

  const serialized = JSON.stringify(sanitized);

  if (
    Buffer.byteLength(serialized, "utf8") >
    MAX_METADATA_BYTES
  ) {
    return {
      truncated: true,
      reason: "metadata_size_limit_exceeded",
    };
  }

  return sanitized;
}

export function parseObservabilityTimestamp(
  value: unknown,
  fallback = new Date(),
): Date {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? fallback
      : value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const milliseconds =
      value > 0 && value < 10_000_000_000
        ? value * 1000
        : value;

    const date = new Date(milliseconds);

    return Number.isNaN(date.getTime())
      ? fallback
      : date;
  }

  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? fallback
      : date;
  }

  return fallback;
}

export type PersistObservabilityEventInput = {
  category: unknown;
  eventType: unknown;
  severity?: unknown;
  source: unknown;
  route?: unknown;
  sessionId?: unknown;
  userId?: unknown;
  testerId?: unknown;
  targetId?: unknown;
  message?: unknown;
  durationMs?: unknown;
  value?: unknown;
  metadata?: unknown;
  occurredAt?: unknown;
};

export async function persistObservabilityEvent(
  input: PersistObservabilityEventInput,
) {
  const category = clampString(input.category, 80);
  const eventType = clampString(input.eventType, 120);
  const source = clampString(input.source, 120);

  if (!category || !eventType || !source) {
    throw new Error(
      "invalid_observability_event_identity",
    );
  }

  return prisma.observabilityEvent.create({
    data: {
      category,
      eventType,
      severity:
        clampString(input.severity, 24) || "info",
      source,
      route: clampString(input.route, 300),
      sessionId: clampString(input.sessionId, 200),
      userId: clampString(input.userId, 200),
      testerId: clampString(input.testerId, 200),
      targetId: clampString(input.targetId, 300),
      message: clampString(input.message, 2_000),
      durationMs: finiteInteger(input.durationMs),
      value: finiteNumber(input.value),
      metadata: sanitizeObservabilityMetadata(
        input.metadata,
      ),
      occurredAt: parseObservabilityTimestamp(
        input.occurredAt,
      ),
    },
  });
}

export type PersistErrorReportInput = {
  level?: unknown;
  name?: unknown;
  message: unknown;
  stack?: unknown;
  route?: unknown;
  userAgent?: unknown;
  sessionId?: unknown;
  userId?: unknown;
  metadata?: unknown;
  occurredAt?: unknown;
};

export async function persistErrorReport(
  input: PersistErrorReportInput,
) {
  const message = clampString(input.message, 2_000);

  if (!message) {
    throw new Error("error_report_message_required");
  }

  return prisma.errorReport.create({
    data: {
      level:
        clampString(input.level, 24) || "error",
      name: clampString(input.name, 160),
      message,
      stack: clampString(input.stack, 8_000),
      route: clampString(input.route, 300),
      userAgent: clampString(input.userAgent, 600),
      sessionId: clampString(input.sessionId, 200),
      userId: clampString(input.userId, 200),
      metadata: sanitizeObservabilityMetadata(
        input.metadata,
      ),
      occurredAt: parseObservabilityTimestamp(
        input.occurredAt,
      ),
    },
  });
}
